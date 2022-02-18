import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IamportPayment } from '../pg';
import { AlreadyTotalAmountCanceledError } from './error/AlreadyTotalAmountCanceledError';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  constructor(data: IamportPayment) {
    Object.assign(this, data);
  }

  @Prop({ required: true, index: true, unique: true })
  merchantUid: string;

  @Prop({ required: true, unique: true })
  impUid: string;

  @Prop()
  applyNum: string;

  @Prop()
  amount: number;

  @Prop()
  name: string;

  @Prop()
  buyerEmail: string;

  @Prop()
  buyerName: string;

  @Prop()
  buyerTel: string;

  @Prop()
  receiptUrl: string;

  @Prop()
  failedAt: number;

  @Prop()
  startedAt: number;

  @Prop()
  paidAt: number;

  @Prop()
  status: string;

  @Prop()
  userAgent: string;

  @Prop()
  payMethod: string;

  @Prop()
  channel: string;

  @Prop()
  currency: string;

  @Prop()
  pgProvider: string;

  @Prop()
  embPgProvider: string;

  @Prop()
  pgTid: string;

  @Prop()
  pgId: string;

  @Prop()
  customerUid: string | null;

  @Prop()
  customerUidUsage: string | null;

  @Prop()
  customData: string | null;

  @Prop()
  cardCode: string;

  @Prop()
  cardName: string;

  @Prop()
  cardNumber: string;

  @Prop()
  cardQuota: number;

  @Prop()
  cardType: number;

  @Prop()
  bankCode: string;

  @Prop()
  bankName: string;

  @Prop()
  failReason: string | null;

  @Prop()
  cancelledAt: number;

  @Prop()
  cancelAmount: number;

  @Prop([
    raw({
      pgTid: { type: String },
      amount: { type: Number },
      cancelledAt: { type: Number },
      reason: { type: String },
      receiptUrl: { type: String },
    }),
  ])
  cancelHistory: Record<string, any>[];

  @Prop()
  cancelReason: string | null;

  @Prop([String])
  cancelReceiptUrls: string[];

  @Prop()
  escrow: boolean;

  @Prop()
  cashReceiptIssued: boolean;

  getCancelableAmount(): number {
    const cancelableAmount = this.amount - this.cancelAmount;

    if (cancelableAmount <= 0) {
      throw new AlreadyTotalAmountCanceledError();
    }

    return cancelableAmount;
  }
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
