import { IsNumber, IsString } from 'class-validator';

export class CartOrderRequest {
  @IsNumber({}, { each: true })
  cartItemIds: number[];

  @IsString()
  impUid: string;

  @IsString()
  merchantUid: string;

  static create(cartItemIds: number[], impUid: string, merchantUid: string) {
    const dto = new CartOrderRequest();
    dto.cartItemIds = cartItemIds;
    dto.impUid = impUid;
    dto.merchantUid = merchantUid;

    return dto;
  }
}
