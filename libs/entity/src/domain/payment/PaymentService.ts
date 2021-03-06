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

  async save(impUid: string): Promise<PaymentDocument> {
    const payment = await this.iamportService.getPayment(impUid);
    return await this.paymentRepository.save(payment);
  }

  async cancel(
    merchantUid: string,
    reason: string,
    cancelRequestAmount?: number,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentRepository.findOneOrFail(merchantUid);

    const canceledPayment = await this.iamportService.cancelPayment(
      payment.impUid,
      reason,
      payment.getCancelableAmount(),
      cancelRequestAmount,
    );

    return await this.paymentRepository.save(canceledPayment);
  }
}
