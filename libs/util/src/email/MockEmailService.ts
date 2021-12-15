import { EmailService } from '.';

export class MockEmailService implements EmailService {
  send(to: string, content: string): Promise<void> {
    console.log(`Send email(${content}) to ${to}`);
    return;
  }
}
