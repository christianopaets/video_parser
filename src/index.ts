import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {VideoController} from './controllers/video.controller';
import {useContainer as useRoutingControllerContainer} from 'routing-controllers/container';
import {Container} from 'typedi';
import {createConnection, useContainer as useTypeormContainer} from 'typeorm/index';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {RoutingControllersOptions} from 'routing-controllers/RoutingControllersOptions';
import {MainController} from './controllers/main.controller';

const expressConfig: RoutingControllersOptions = {
  controllers: [
    VideoController,
    MainController
  ],
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }
}

useRoutingControllerContainer(Container);
useTypeormContainer(Container);

fromPromise(createConnection())
  .pipe(map(() => createExpressServer(expressConfig)))
  .subscribe(app => {
    app.listen(process.env.PORT || 3100);
  });
