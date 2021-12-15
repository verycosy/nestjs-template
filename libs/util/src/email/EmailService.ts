export const EMAIL_SERVICE = Symbol('EmailService');
export interface EmailService {
  send(
    from: string,
    to: string,
    subject: string,
    content: string,
  ): Promise<void>;
}
