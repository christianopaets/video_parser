import {Get, JsonController, Post, QueryParam} from 'routing-controllers';
import {WebScrappingService} from '../services/web-scrapping.service';
import {getMongoManager, MongoRepository} from 'typeorm';
import {Video} from '../entity/Video';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {forkJoin} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, switchMap} from 'rxjs/operators';
import differenceBy from 'lodash/differenceBy';

@JsonController('/videos')
export class VideoController {

  constructor(private readonly webScrappingService: WebScrappingService,
              @InjectRepository(Video) private readonly videoRepository: MongoRepository<Video>) {
  }

  @Get()
  async getVideoList(@QueryParam('page') page: number, @QueryParam('offset') offset: number = 9): Promise<{videos: Video[], total: number}> {
    return {
      videos: await this.videoRepository.find({
        order: {
          _id: -1
        },
        take: offset,
        skip: offset * (page - 1)
      }),
      total: await this.videoRepository.count()
    }
  }

  @Post()
  scrapVideos(): Promise<Video[]> {
    return forkJoin([
      fromPromise(getMongoManager().find(Video)),
      this.webScrappingService.getWebsiteData()
    ])
      .pipe(map(([savedVideo, newVideo]) => differenceBy(newVideo, savedVideo, 'link')))
      .pipe(switchMap(video => this.videoRepository.save(video)))
      .toPromise();
  }
}
