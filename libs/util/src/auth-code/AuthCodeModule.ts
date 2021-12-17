import { Module } from '@nestjs/common';
import { AuthCodeIssuer, AuthCodeService } from '.';
import { RedisModule } from '../cache';
import { EMAIL_SERVICE, GmailService } from '../email';
import { SensSmsService } from '../sms/SensSmsService';
import { SMS_SERVICE } from '../sms/SmsService';

@Module({
  imports: [RedisModule],
  providers: [
    AuthCodeIssuer,
    AuthCodeService,
    {
      provide: SMS_SERVICE,
      useClass: SensSmsService,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: GmailService,
    },
  ],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
