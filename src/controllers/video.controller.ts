import {Get, JsonController, QueryParam} from 'routing-controllers';
import {WebScrappingService} from '../services/web-scrapping.service';
import {MongoRepository} from 'typeorm';
import {Video} from '../entity/Video';
import {InjectRepository} from 'typeorm-typedi-extensions';

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
}
