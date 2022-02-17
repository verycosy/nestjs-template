import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IamportService, IamportPayment } from '../pg';
import { Payment, PaymentDocument } from './Payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly iamportService: IamportService,
  ) {}

  async complete(impUid: string): Promise<IamportPayment> {
    return await this.iamportService.getPayment(impUid);
  }

  async cancel(
    merchantUid: string,
    reason: string,
    cancelRequestAmount?: number,
  ): Promise<IamportPayment> {
    const payment = await this.paymentModel.findOne({
      merchant_uid: merchantUid,
    });

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
    return response;
  }

  async save(iamportPaymentData: IamportPayment): Promise<PaymentDocument> {
    return await this.paymentModel.create(iamportPaymentData);
  }
}
