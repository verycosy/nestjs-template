import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { User } from '@app/entity/domain/user/User.entity';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('/users')
export class UserApiController {
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
