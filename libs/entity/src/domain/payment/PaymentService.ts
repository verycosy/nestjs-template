import { Injectable } from '@nestjs/common';
import { IamportService } from '../pg';
import { PaymentDocument } from './Payment.schema';
import { PaymentRepository } from './PaymentRepository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly iamportService: IamportService,
  ) {}

  async complete(impUid: string): Promise<PaymentDocument> {
    const payment = await this.iamportService.getPayment(impUid);
    return await this.paymentRepository.save(payment);
  }

  async cancel(
    merchantUid: string,
    reason: string,
    cancelRequestAmount?: number,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentRepository.findOneByMerchantUid(
      merchantUid,
    );

    if (!payment) {
      return null;
    }

    const response = await this.iamportService.cancelPayment(
      payment.imp_uid,
      reason,
      payment.getCancelableAmount(),
      cancelRequestAmount,
    );

    await payment.update(response, { new: true });
    return payment;
  }
}
