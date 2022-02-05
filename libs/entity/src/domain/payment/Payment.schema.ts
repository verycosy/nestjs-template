import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true, index: true, unique: true })
  merchant_uid: string;

  @Prop({ required: true, unique: true })
  imp_uid: string;

  @Prop()
  apply_num: string;

  @Prop()
  amount: number;

  @Prop()
  name: string;

  @Prop()
  buyer_email: string;

  @Prop()
  buyer_name: string;

  @Prop()
  buyer_tel: string;

  @Prop()
  receipt_url: string;

  @Prop()
  failed_at: number;

  @Prop()
  started_at: number;

  @Prop()
  paid_at: number;

  @Prop()
  status: string;

  @Prop()
  user_agent: string;

  @Prop()
  pay_method: string;

  @Prop()
  channel: string;

  @Prop()
  currency: string;

  @Prop()
  pg_provider: string;

  @Prop()
  emb_pg_provider: string;

  @Prop()
  pg_tid: string;

  @Prop()
  pg_id: string;

  @Prop()
  customer_uid: string | null;

  @Prop()
  customer_uid_usage: string | null;

  @Prop()
  custom_data: string | null;

  @Prop()
  card_code: string;

  @Prop()
  card_name: string;

  @Prop()
  card_number: string;

  @Prop()
  card_quota: number;

  @Prop()
  card_type: number;

  @Prop()
  bank_code: string;

  @Prop()
  bank_name: string;

  @Prop()
  fail_reason: string | null;

  @Prop()
  cancelled_at: number;

  @Prop()
  cancel_amount: number;

  @Prop([
    raw({
      pg_tid: { type: String },
      amount: { type: Number },
      cancelled_at: { type: Number },
      reason: { type: String },
      receipt_url: { type: String },
    }),
  ])
  cancel_history: Record<string, any>[];

  @Prop()
  cancel_reason: string | null;

  @Prop([String])
  cancel_receipt_urls: string[];

  @Prop()
  escrow: boolean;

  @Prop()
  cash_receipt_issued: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
