import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IamportPayment } from '../pg';
import { Payment, PaymentDocument } from './Payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async findOneByMerchantUid(merchantUid: string): Promise<PaymentDocument> {
    return await this.paymentModel.findOne({
      merchant_uid: merchantUid,
    });
  }

  async save(iamportPayment: IamportPayment): Promise<PaymentDocument> {
    return await this.paymentModel.findOneAndUpdate(
      { merchant_uid: iamportPayment.merchant_uid },
      iamportPayment,
      { new: true, upsert: true },
    );
  }
}
