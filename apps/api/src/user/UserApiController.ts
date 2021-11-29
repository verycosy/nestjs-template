import { Controller, Get } from '@nestjs/common';
import { UserApiService } from './UserApiService';

@Controller('/users')
export class UserApiController {
  constructor(private readonly userApiService: UserApiService) {}

  @Get('/hello')
  sayHello() {
    return this.userApiService.sayHello();
  }
}
