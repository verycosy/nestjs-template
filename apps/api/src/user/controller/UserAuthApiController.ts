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
  CheckEmailExistsRequest,
  FindEmailRequest,
  SmsRequest,
  FindPasswordRequest,
} from '../dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenGuard,
  AuthService,
  CurrentUser,
  RefreshTokenGuard,
} from '@app/auth';
import { AuthToken } from '@app/auth/interface';
import { EntityNotFoundError } from 'typeorm';
import { ResponseEntity } from '@app/config/response';

@ApiTags('Users API')
@Controller('/users')
export class UserAuthApiController {
  constructor(
    private readonly authCodeService: AuthCodeService,
    private readonly authService: AuthService,
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
    const isExists = await this.authService.checkEmailExists(
      request.email,
      request.role,
    );

    return {
      exists: isExists,
    };
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    try {
      await this.authCodeService.checkVerified(request.phoneNumber);
      request.checkEqualPassword();

      return await this.authService.signUp(await request.toEntity());
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/login')
  async login(@Body() request: LoginRequest) {
    const { email, password } = request;
    try {
      const user = await this.authService.login(email, password);
      return ResponseEntity.OK_WITH(user);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw err;
      }

      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @Post('/find-email')
  async findEmail(@Body() request: FindEmailRequest) {
    const { name, phoneNumber, role } = request;

    await this.authCodeService.checkVerified(phoneNumber);

    const email = await this.authService.findEmail(name, phoneNumber, role);
    return { email };
  }

  @Post('/find-password')
  async findPasswordVerify(@Body() request: FindPasswordRequest.Verify) {
    const { email, phoneNumber, role } = request;

    await this.authCodeService.checkVerified(phoneNumber);

    const accessToken = await this.authService.getAccessTokenForFindPassword(
      email,
      phoneNumber,
      role,
    );

    return {
      accessToken,
    };
  }

  @AccessTokenGuard()
  @Patch('/find-password')
  async findPassword(
    @CurrentUser() user: User,
    @Body() request: FindPasswordRequest.ChangePassword,
  ): Promise<void> {
    try {
      request.checkEqualPassword();
      await this.authService.changePassword(user, request.password);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
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
}
