import { Payment } from '../payment/Payment.schema';

export interface PgService {
  getPayment(merchantUid: string): Promise<Payment>;
  cancelPayment(
    merchantUid: string,
    reason: string,
    checksum: number,
    cancelRequestAmount?: number,
  ): Promise<Payment>;
}
