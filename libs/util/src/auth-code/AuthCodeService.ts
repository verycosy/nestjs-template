import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SERVICE, EmailService } from '../email';
import { SmsService, SMS_SERVICE } from '../sms/SmsService';
import { AuthCodeIssuer } from './AuthCodeIssuer';

@Injectable()
export class AuthCodeService {
  constructor(
    private readonly authCodeIssuer: AuthCodeIssuer,
    @Inject(SMS_SERVICE) private readonly smsService: SmsService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {}

  async sendViaSms(phoneNumber: string): Promise<void> {
    const authCode = this.authCodeIssuer.generate();

    await this.authCodeIssuer.setAuthCodeTo(phoneNumber, authCode);
    await this.smsService.send('010-0000-0000', phoneNumber, authCode);
  }

  async sendViaEmail(email: string): Promise<void> {
    const authCode = this.authCodeIssuer.generate();

    await this.authCodeIssuer.setAuthCodeTo(email, authCode);
    await this.emailService.send(
      'admin@admin.com',
      email,
      '이메일 인증코드입니다.',
      `[인증코드] : ${authCode}`,
    );
  }

  async verify(emailOrPhoneNumber: string, authCode: string): Promise<boolean> {
    const result = await this.authCodeIssuer.verifyAuthCodeVia(
      emailOrPhoneNumber,
      authCode,
    );

    if (result) {
      await this.authCodeIssuer.setVerified(emailOrPhoneNumber);
    }

    return result;
  }

  async isVerified(emailOrPhoneNumber: string): Promise<boolean> {
    const result = await this.authCodeIssuer.isVerified(emailOrPhoneNumber);

    if (result) {
      await this.authCodeIssuer.release(emailOrPhoneNumber);
    }

    return result;
  }
}
