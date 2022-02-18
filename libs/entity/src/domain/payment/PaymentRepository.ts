import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './Payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async findOneByMerchantUid(merchantUid: string): Promise<PaymentDocument> {
    return await this.paymentModel.findOne({
      merchantUid: merchantUid,
    });
  }

  async save(payment: Payment): Promise<PaymentDocument> {
    return await this.paymentModel.findOneAndUpdate(
      { merchantUid: payment.merchantUid },
      payment,
      { new: true, upsert: true },
    );
  }
}
