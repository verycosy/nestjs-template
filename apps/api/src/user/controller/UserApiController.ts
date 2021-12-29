import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { User } from '@app/entity/domain/user/User.entity';
import { AuthCodeService } from '@app/util/auth-code';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePhoneNumberRequest } from '../dto';
import { UserApiService } from '../UserApiService';

@AccessTokenGuard()
@Controller('/users')
export class UserApiController {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly authCodeService: AuthCodeService,
  ) {}

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

  @Patch('/me/phone-number')
  async updatePhoneNumber(
    @CurrentUser() user: User,
    @Body() request: UpdatePhoneNumberRequest,
  ) {
    const { phoneNumber: newPhoneNumber } = request;
    const isVerifiedPhoneNumber = await this.authCodeService.isVerified(
      newPhoneNumber,
    );

    if (!isVerifiedPhoneNumber) {
      throw new BadRequestException('Phone number does not verified');
    }

    await this.userApiService.updatePhoneNumber(user, newPhoneNumber);

    return { phoneNumber: newPhoneNumber };
  }
}
