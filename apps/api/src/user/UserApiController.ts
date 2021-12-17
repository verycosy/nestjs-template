import { User } from '@app/entity/domain/user/User.entity';
import { AuthCodeService } from '@app/util/auth-code';
import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
} from '@nestjs/common';
import { SignUpRequest } from './dto/SignUpRequest';
import { SignUpService } from './SignUpService';
import * as SmsRequest from './dto/SmsRequest';

@Controller('/users')
export class UserApiController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly authCodeSevice: AuthCodeService,
  ) {}

  @Post('/sms')
  async sendAuthCode(@Body() request: SmsRequest.SendAuthCode): Promise<void> {
    await this.authCodeSevice.sendViaSms(request.phoneNumber);
  }

  @Patch('/sms')
  async verifyAuthCode(
    @Body() request: SmsRequest.VerifyAuthCode,
  ): Promise<void> {
    const { phoneNumber, authCode } = request;
    await this.authCodeSevice.verify(phoneNumber, authCode);
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    const isVerifiedPhoneNumber = await this.authCodeSevice.isVerified(
      request.phoneNumber,
    );

    if (!isVerifiedPhoneNumber) {
      throw new BadRequestException('Phone number does not verified');
    }

    if (!request.isEqualPassword()) {
      throw new BadRequestException('Password does not matched');
    }

    return await this.signUpService.signUp(await request.toEntity());
  }
}
