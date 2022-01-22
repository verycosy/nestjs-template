import { IsNumber } from 'class-validator';

export class AddCartItemRequest {
  @IsNumber()
  productId: number;

  @IsNumber()
  count: number;

  static create(productId: number, count: number) {
    const dto = new AddCartItemRequest();
    dto.productId = productId;
    dto.count = count;

    return dto;
  }
}
