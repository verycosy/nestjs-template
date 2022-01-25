import { IsNumber } from 'class-validator';

export class CartOrderRequest {
  @IsNumber({}, { each: true })
  cartItemIds: number[];

  static create(cartItemIds: number[]) {
    const dto = new CartOrderRequest();
    dto.cartItemIds = cartItemIds;

    return dto;
  }
}
