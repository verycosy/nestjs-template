import { Provider } from '@nestjs/common';
import { MockSmsService, SensSmsService, SMS_SERVICE } from '.';

export function getSmsServiceProvider(): Provider {
  return {
    provide: SMS_SERVICE,
    useClass: process.env.NODE_ENV === 'test' ? MockSmsService : SensSmsService,
  };
}
