import { IsNumber } from 'class-validator';

export class CartOrderReadyRequest {
  @IsNumber({}, { each: true })
  cartItemIds: number[];

  constructor(cartItemIds: number[]) {
    this.cartItemIds = cartItemIds;
  }
}
