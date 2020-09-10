import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {VideoController} from './controllers/video.controller';
import {useContainer} from 'routing-controllers/container';
import {Container} from 'typedi';
import {createConnection, getMongoManager} from 'typeorm/index';
import {schedule} from 'node-cron';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {RoutingControllersOptions} from 'routing-controllers/RoutingControllersOptions';
import {WebScrappingService} from './services/web-scrapping.service';
import {Video} from './entity/Video';
import {forkJoin} from 'rxjs';
import differenceBy from 'lodash/differenceBy';

const expressConfig: RoutingControllersOptions = {
  controllers: [
    VideoController
  ]
}

useContainer(Container);

fromPromise(createConnection())
  .pipe(map(() => createExpressServer(expressConfig)))
  .subscribe(app => {
    startSchedule();
    app.listen(process.env.PORT ||  3100);
  });

function startSchedule(): void {
  schedule("0,15,30,45 * * * *", () => {
    const webScrappingService: WebScrappingService = Container.get(WebScrappingService);
    forkJoin([
      fromPromise(getMongoManager().find(Video)),
      webScrappingService.getWebsiteData()
    ])
      .pipe(map(([savedVideo, newVideo]) => differenceBy(newVideo, savedVideo, 'url')))
      .subscribe(video => getMongoManager().save(video))
  });
}
