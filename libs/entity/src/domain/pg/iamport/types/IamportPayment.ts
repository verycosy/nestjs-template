import { Expose } from 'class-transformer';

export class IamportPayment {
  @Expose({ name: 'imp_uid' })
  impUid: string;

  @Expose({ name: 'merchant_uid' })
  merchantUid: string;

  @Expose({ name: 'apply_num' })
  applyNum: string;

  amount: number;
  name: string;

  @Expose({ name: 'buyer_email' })
  buyerEmail: string;

  @Expose({ name: 'buyer_name' })
  buyerName: string;

  @Expose({ name: 'buyer_tel' })
  buyerTel: string;

  @Expose({ name: 'receipt_url' })
  receiptUrl: string;

  @Expose({ name: 'failed_at' })
  failedAt: number;

  @Expose({ name: 'started_at' })
  startedAt: number;

  @Expose({ name: 'paid_at' })
  paidAt: number;

  status: string;

  @Expose({ name: 'user_agent' })
  userAgent: string;

  @Expose({ name: 'pay_method' })
  payMethod: string;

  channel: string;

  currency: string;

  @Expose({ name: 'pg_provider' })
  pgProvider: string;

  @Expose({ name: 'emb_pg_provider' })
  embPgProvider: string;

  @Expose({ name: 'pg_tid' })
  pgTid: string;

  @Expose({ name: 'pg_id' })
  pgId: string;

  @Expose({ name: 'customer_uid' })
  customerUid: string | null;

  @Expose({ name: 'customer_uid_usage' })
  customerUidUsage: string | null;

  @Expose({ name: 'custom_data' })
  customData: string | null;

  @Expose({ name: 'card_code' })
  cardCode: string;

  @Expose({ name: 'card_name' })
  cardName: string;

  @Expose({ name: 'card_number' })
  cardNumber: string;

  @Expose({ name: 'card_quota' })
  cardQuota: number;

  @Expose({ name: 'card_type' })
  cardType: number;

  @Expose({ name: 'bank_code' })
  bankCode: string;

  @Expose({ name: 'bank_name' })
  bankName: string;

  @Expose({ name: 'fail_reason' })
  failReason: string | null;

  @Expose({ name: 'cancelled_at' })
  cancelledAt: number;

  @Expose({ name: 'cancel_amount' })
  cancelAmount: number;

  escrow: boolean;

  @Expose({ name: 'cash_receipt_issued' })
  cashReceiptIssued: boolean;

  @Expose({ name: 'cancel_reason' })
  cancelReason: string | null;

  cancel_history: {
    pg_tid: string;
    amount: number;
    cancelled_at: number;
    reason: string;
    receipt_url: string;
  }[];

  cancel_receipt_urls: string[];
}
