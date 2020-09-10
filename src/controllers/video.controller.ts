import {Get, JsonController} from 'routing-controllers/index';
import {WebScrappingService} from '../services/web-scrapping.service';
import {MongoRepository} from 'typeorm/index';
import {Video} from '../entity/Video';
import {InjectRepository} from 'typeorm-typedi-extensions';

@JsonController('/videos')
export class VideoController {

  constructor(private readonly webScrappingService: WebScrappingService,
              @InjectRepository(Video) private readonly videoRepository: MongoRepository<Video>) {
  }

  @Get()
  getVideoList(): Promise<Video[]> {
    return this.videoRepository.find();
  }
}
