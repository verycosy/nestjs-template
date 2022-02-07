import { Module } from '@nestjs/common';
import { AuthCodeIssuer, AuthCodeService } from '.';
import { CustomCacheModule } from '../cache';
import { getEmailServiceProvider } from '../email';
import { getSmsServiceProvider } from '../sms';

@Module({
  imports: [CustomCacheModule],
  providers: [
    AuthCodeIssuer,
    AuthCodeService,
    getSmsServiceProvider(),
    getEmailServiceProvider(),
  ],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
