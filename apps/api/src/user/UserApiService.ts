import { Injectable } from '@nestjs/common';

@Injectable()
export class UserApiService {
  sayHello() {
    return 'hello';
  }
}
