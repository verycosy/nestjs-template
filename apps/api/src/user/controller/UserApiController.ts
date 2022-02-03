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
import {
  UserApiService,
  ChangePasswordRequest,
  UpdatePhoneNumberRequest,
  LikedProductItem,
} from '../';

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
    await this.authCodeService.checkVerified(newPhoneNumber);

    await this.userApiService.updatePhoneNumber(user, newPhoneNumber);

    return { phoneNumber: newPhoneNumber };
  }

  @Patch('/me/password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() request: ChangePasswordRequest,
  ): Promise<void> {
    const { oldPassword, password } = request;

    try {
      request.checkEqualPassword();
      await this.userApiService.changePassword(user, oldPassword, password);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/me/liked')
  async getLikedProducts(@CurrentUser() user: User) {
    const likedProducts = await user.liked;
    return likedProducts.map((product) => new LikedProductItem(product));
  }
}
