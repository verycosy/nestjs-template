import { IamportResponse } from './IamportResponse';

export interface IamportPayment {
  imp_uid: string;
  merchant_uid: string;
  apply_num: string;
  amount: number;
  name: string;
  buyer_email: string;
  buyer_name: string;
  buyer_tel: string;
  receipt_url: string;
  failed_at: number;
  started_at: number;
  paid_at: number;
  status: string;
  user_agent: string;
  pay_method: string;
  channel: string;
  currency: string;
  pg_provider: string;
  emb_pg_provider: string;
  pg_tid: string;
  pg_id: string;
  customer_uid: string | null;
  customer_uid_usage: string | null;
  custom_data: string | null;
  card_code: string;
  card_name: string;
  card_number: string;
  card_quota: number;
  card_type: number;
  bank_code: string;
  bank_name: string;
  fail_reason: string | null;
  cancelled_at: number;
  cancel_amount: number;
  cancel_history: {
    pg_tid: string;
    amount: number;
    cancelled_at: number;
    reason: string;
    receipt_url: string;
  }[];
  cancel_reason: string | null;
  cancel_receipt_urls: string[];
  escrow: boolean;
  cash_receipt_issued: boolean;
}

export type IamportPaymentResponse = IamportResponse<IamportPayment>;
