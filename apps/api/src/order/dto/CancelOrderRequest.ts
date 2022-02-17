import { IsNumber, IsString } from 'class-validator';

// TODO: 취소 유형 분류, 취소 사유 저장
export class CancelOrderRequest {
  @IsString()
  merchantUid: string;

  @IsString()
  reason: string;

  @IsNumber()
  orderItemId: number;

  constructor(merchantUid: string, reason: string, orderItemId: number) {
    this.merchantUid = merchantUid;
    this.reason = reason;
    this.orderItemId = orderItemId;
  }
}
