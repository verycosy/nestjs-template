import { SmsService } from './SmsService';

export class MockSmsService implements SmsService {
  send(from: string, to: string, content: string): Promise<void> {
    console.log('send sms');
    return;
  }
}
