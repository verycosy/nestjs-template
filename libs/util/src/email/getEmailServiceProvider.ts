import { Provider } from '@nestjs/common';
import { EMAIL_SERVICE, GmailService } from '.';

export function getEmailServiceProvider(): Provider {
  return {
    provide: EMAIL_SERVICE,
    useClass: GmailService,
  };
}
