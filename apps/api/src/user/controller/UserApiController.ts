import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateProfileRequest } from '../dto/UpdateProfileRequest';
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
  async updateProfile(
    @CurrentUser() user: User,
    @Body() request: UpdateProfileRequest,
  ) {
    await this.userApiService.updateProfile(user, request.name);
    return {
      name: user.getName(),
    };
  }
}
