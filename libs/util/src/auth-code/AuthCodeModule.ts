import { Module } from '@nestjs/common';
import { AuthCodeIssuer, AuthCodeService } from '.';
import { RedisModule } from '../cache';
import { getEmailServiceProvider } from '../email';
import { getSmsServiceProvider } from '../sms';

@Module({
  imports: [RedisModule],
  providers: [
    AuthCodeIssuer,
    AuthCodeService,
    getSmsServiceProvider(),
    getEmailServiceProvider(),
  ],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
