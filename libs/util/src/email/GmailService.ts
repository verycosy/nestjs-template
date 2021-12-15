import { EmailService } from './EmailService';

export class GmailService implements EmailService {
  send(
    from: string,
    to: string,
    subject: string,
    content: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
