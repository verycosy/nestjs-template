import { Provider } from '@nestjs/common';
import { EMAIL_SERVICE, GmailService, MockEmailService } from '.';

export function getEmailServiceProvider(): Provider {
  return {
    provide: EMAIL_SERVICE,
    useClass: process.env.NODE_ENV === 'test' ? MockEmailService : GmailService,
  };
}
