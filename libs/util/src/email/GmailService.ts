import { EmailService } from './EmailService';

export class GmailService implements EmailService {
  send(to: string, content: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
