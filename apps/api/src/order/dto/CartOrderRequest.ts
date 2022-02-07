import { IsNumber, IsString } from 'class-validator';

export class Ready {
  @IsNumber({}, { each: true })
  cartItemIds: number[];

  constructor(cartItemIds: number[]) {
    this.cartItemIds = cartItemIds;
  }
}

export class Complete {
  @IsString()
  impUid: string;

  @IsString()
  merchantUid: string;

  constructor(impUid: string, merchantUid: string) {
    this.impUid = impUid;
    this.merchantUid = merchantUid;
  }
}
