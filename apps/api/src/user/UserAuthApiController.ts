import { User } from '@app/entity/domain/user/User.entity';
import { AuthCodeService } from '@app/util/auth-code';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignUpRequest } from './dto/SignUpRequest';
import { UserApiService } from './UserApiService';
import * as SmsRequest from './dto/SmsRequest';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, AccessTokenGuard, CurrentUser } from '@app/auth';
import { LoginRequest } from './dto/LoginRequest';

@ApiTags('Users API')
@Controller('/users')
export class UserAuthApiController {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly authCodeSevice: AuthCodeService,
    private readonly authService: AuthService,
  ) {}

  @Post('/sms')
  async sendAuthCode(@Body() request: SmsRequest.SendAuthCode): Promise<void> {
    await this.authCodeSevice.sendViaSms(request.phoneNumber);
  }

  @ApiOperation({
    summary: 'SMS 인증코드 검증',
  })
  @ApiBody({ type: SmsRequest.VerifyAuthCode })
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

    return await this.userApiService.signUp(await request.toEntity());
  }

  @Post('/login')
  async login(@Body() request: LoginRequest) {
    const { email, password } = request;
    return await this.authService.login(email, password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
