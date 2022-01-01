import { EmailService } from '.';

export class MockEmailService implements EmailService {
  send(
    from: string,
    to: string,
    subject: string,
    content: string,
  ): Promise<void> {
    return;
  }
}
