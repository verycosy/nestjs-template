import { User } from '@app/entity/domain/user/User.entity';
import { AuthCodeService } from '@app/util/auth-code';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import {
  SignUpRequest,
  LoginRequest,
  ChangePasswordRequest,
  CheckEmailExistsRequest,
  FindEmailRequest,
  SmsRequest,
} from '../dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenGuard,
  AuthService,
  CurrentUser,
  RefreshTokenGuard,
} from '@app/auth';
import { AuthToken } from '@app/auth/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Users API')
@Controller('/users')
export class UserAuthApiController {
  constructor(
    private readonly authCodeService: AuthCodeService,
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Post('/sms')
  async sendAuthCode(@Body() request: SmsRequest.SendAuthCode): Promise<void> {
    await this.authCodeService.sendViaSms(request.phoneNumber);
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
    await this.authCodeService.verify(phoneNumber, authCode);
  }

  @Post('/check-email')
  async checkEmailExists(@Body() request: CheckEmailExistsRequest) {
    const isExists = await this.authService.checkEmailExists(request.email);

    return {
      exists: isExists,
    };
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    const isVerifiedPhoneNumber = await this.authCodeService.isVerified(
      request.phoneNumber,
    );

    if (!isVerifiedPhoneNumber) {
      throw new BadRequestException('Phone number does not verified');
    }

    if (!request.isEqualPassword()) {
      throw new BadRequestException('Password does not matched');
    }

    return await this.authService.signUp(await request.toEntity());
  }

  @Post('/login')
  async login(@Body() request: LoginRequest) {
    const { email, password } = request;
    return await this.authService.login(email, password);
  }

  @Post('/find-email')
  async findEmail(@Body() request: FindEmailRequest) {
    const { name, phoneNumber } = request;

    const isVerifiedPhoneNumber = await this.authCodeService.isVerified(
      phoneNumber,
    );

    if (!isVerifiedPhoneNumber) {
      throw new BadRequestException('Phone number does not verified');
    }

    const user = await this.userRepository.findOne({ name, phoneNumber });

    if (user) {
      return { email: user.email };
    }

    return { email: null };
  }

  @AccessTokenGuard()
  @Get('/logout')
  async logout(@CurrentUser() user: User): Promise<void> {
    await this.authService.logout(user);
  }

  @RefreshTokenGuard()
  @Patch('/refresh')
  async refresh(@CurrentUser() user: User): Promise<AuthToken> {
    return await this.authService.refresh(user);
  }

  @AccessTokenGuard()
  @Patch('/password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() request: ChangePasswordRequest,
  ): Promise<void> {
    const { oldPassword, newPassword } = request;

    if (!request.isEqualNewPassword()) {
      throw new BadRequestException('Password does not matched');
    }

    await this.authService.changePassword(user, oldPassword, newPassword);
  }
}
