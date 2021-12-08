import { User } from '@app/entity/domain/user/User.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { SignUpRequest } from './dto/SignUpRequest';
import { UserApiService } from './UserApiService';

@Controller('/users')
export class UserApiController {
  constructor(private readonly userApiService: UserApiService) {}

  @Get('/hello')
  sayHello() {
    return {
      message: this.userApiService.sayHello(),
    };
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    if (!request.isEqualPassword()) {
      throw new BadRequestException('Password does not matched');
    }

    return await this.userApiService.signUp(request.toEntity());
  }
}
