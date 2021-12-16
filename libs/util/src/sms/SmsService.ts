export const SMS_SERVICE = Symbol('SmsService');
export interface SmsService {
  send(from: string, to: string, content: string): Promise<void>;
}
