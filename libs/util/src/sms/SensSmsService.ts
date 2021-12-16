import { SmsService } from './SmsService';

export class SensSmsService implements SmsService {
  send(from: string, to: string, content: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
