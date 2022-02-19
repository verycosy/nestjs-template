import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from 'typeorm';
import { Payment, PaymentDocument } from './Payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async findOneOrFail(merchantUid: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({
      merchantUid,
    });

    if (payment === null) {
      throw new EntityNotFoundError(Payment, { merchantUid });
    }

    return payment;
  }

  async save(payment: Payment): Promise<PaymentDocument> {
    return await this.paymentModel.findOneAndUpdate(
      { merchantUid: payment.merchantUid },
      payment,
      { new: true, upsert: true },
    );
  }
}
