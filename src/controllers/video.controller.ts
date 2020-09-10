import {Get, JsonController} from 'routing-controllers/index';
import {WebScrappingService} from '../services/web-scrapping.service';

@JsonController('/videos')
export class VideoController {

  constructor(private readonly webScrappingService: WebScrappingService) {
  }

  @Get()
  getVideoList() {
    return this.webScrappingService.getWebsiteData()
      .toPromise();
  }
}
