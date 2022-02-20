import { IsNumber } from 'class-validator';

export class OrderReadyRequest {
  @IsNumber()
  productId: number;

  @IsNumber()
  productOptionId: number;

  @IsNumber()
  quantity: number;

  constructor(productId: number, productOptionId: number, quantity: number) {
    this.productId = productId;
    this.productOptionId = productOptionId;
    this.quantity = quantity;
  }
}
