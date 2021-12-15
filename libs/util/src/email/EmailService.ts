export const EMAIL_SERVICE = Symbol('EmailService');
export interface EmailService {
  send(to: string, content: string): Promise<void>;
}
