import {Get, JsonController} from 'routing-controllers';

@JsonController()
export class MainController {

  @Get()
  main() {
    return { status: 200 };
  }
}
