import { Module } from '@nestjs/common';
import { EMAIL_SERVICE, GmailService } from '.';

@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: GmailService,
    },
  ],
})
export class EmailModule {}
