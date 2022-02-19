import { IsString } from 'class-validator';

export class OrderCompleteRequest {
  @IsString()
  impUid: string;

  @IsString()
  merchantUid: string;

  constructor(impUid: string, merchantUid: string) {
    this.impUid = impUid;
    this.merchantUid = merchantUid;
  }
}
