import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { User } from '@app/entity/domain/user/User.entity';
import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.userApiService.updateProfile(user, file.path);
    return { profileImageUrl: file.path };
  }
}
