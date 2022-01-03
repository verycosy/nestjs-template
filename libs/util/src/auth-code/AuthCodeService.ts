import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EMAIL_SERVICE, EmailService } from '../email';
import { SmsService, SMS_SERVICE } from '../sms/SmsService';
import { AuthCode } from './AuthCode';
import { AuthCodeIssuer } from './AuthCodeIssuer';

@Injectable()
export class AuthCodeService {
  constructor(
    private readonly authCodeIssuer: AuthCodeIssuer,
    @Inject(SMS_SERVICE) private readonly smsService: SmsService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendViaSms(phoneNumber: string): Promise<void> {
    this.logger.info(`Try to send auth code to ${phoneNumber} via sms`);
    await this.authCodeIssuer.checkAuthCodeTrialLimit(phoneNumber);
    const authCode = AuthCode.generate();

    await this.authCodeIssuer.setAuthCodeTo(phoneNumber, authCode);
    await this.smsService.send('010-0000-0000', phoneNumber, authCode.get());
  }

  async sendViaEmail(email: string): Promise<void> {
    await this.authCodeIssuer.checkAuthCodeTrialLimit(email);
    const authCode = AuthCode.generate();

    await this.authCodeIssuer.setAuthCodeTo(email, authCode);
    await this.emailService.send(
      'admin@admin.com',
      email,
      '이메일 인증코드입니다.',
      `[인증코드] : ${authCode}`,
    );
  }

  async verify(
    emailOrPhoneNumber: string,
    authCode: AuthCode,
  ): Promise<boolean> {
    const result = await this.authCodeIssuer.verifyAuthCodeVia(
      emailOrPhoneNumber,
      authCode,
    );

    if (result) {
      await this.authCodeIssuer.setVerified(emailOrPhoneNumber);
    }

    return result;
  }

  async checkVerified(emailOrPhoneNumber: string): Promise<void> {
    const isVerified = await this.authCodeIssuer.isVerified(emailOrPhoneNumber);

    if (!isVerified) {
      throw new Error('Phone number does not verified');
    }

    await this.authCodeIssuer.release(emailOrPhoneNumber);
  }
}
