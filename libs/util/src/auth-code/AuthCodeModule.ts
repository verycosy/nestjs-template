import { Module } from '@nestjs/common';
import { AuthCodeIssuer, AuthCodeService } from '.';

@Module({
  providers: [AuthCodeIssuer, AuthCodeService],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
