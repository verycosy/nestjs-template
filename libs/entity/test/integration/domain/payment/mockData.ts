import { IamportPayment } from '@app/entity/domain/pg/iamport/types';

const pgTid = 'pgtid';

export const iamportPaymentMockData: IamportPayment = {
  amount: 4000,
  apply_num: '30036147',
  bank_code: null,
  bank_name: null,
  //   buyer_addr: '서울특별시 강남구 신사동',
  buyer_email: 'gildong@gmail.com',
  buyer_name: '홍길동',
  //   buyer_postcode: '01181',
  buyer_tel: '010-4242-4242',
  cancel_amount: 0,
  cancel_history: [],
  cancel_reason: null,
  cancel_receipt_urls: [],
  cancelled_at: 0,
  card_code: '381',
  card_name: '국민KB카드',
  card_number: '423280*********6',
  card_quota: 0,
  card_type: 1,
  cash_receipt_issued: false,
  channel: 'pc',
  currency: 'KRW',
  custom_data: null,
  customer_uid: null,
  customer_uid_usage: null,
  emb_pg_provider: 'kbapp',
  escrow: false,
  fail_reason: null,
  failed_at: 0,
  imp_uid: 'imp_313817088792',
  merchant_uid: 'ORD20180131-0000018',
  name: '노르웨이 회전 의자',
  paid_at: 1644069882,
  pay_method: 'card',
  pg_id: 'INIpayTest',
  pg_provider: 'html5_inicis',
  pg_tid: pgTid,
  receipt_url: `https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=${pgTid}&noMethod=1`,
  started_at: 1644069817,
  status: 'paid',
  user_agent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  //   vbank_code: null,
  //   vbank_date: 0,
  //   vbank_holder: null,
  //   vbank_issued_at: 0,
  //   vbank_name: null,
  //   vbank_num: null,
};
