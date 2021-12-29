import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { User } from '@app/entity/domain/user/User.entity';
import { Controller, Get, Patch } from '@nestjs/common';
import { UserApiService } from '../UserApiService';

@AccessTokenGuard()
@Controller('/users')
export class UserApiController {
  constructor(private readonly userApiService: UserApiService) {}

  @Get('/me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('/me')
  async updateProfile() {}
}
