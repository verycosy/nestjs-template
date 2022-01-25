import { IsNumber } from 'class-validator';

export class AddCartItemRequest {
  @IsNumber()
  productId: number;

  @IsNumber()
  productOptionId: number;

  @IsNumber()
  count: number;

  static create(productId: number, productOptionId: number, count: number) {
    const dto = new AddCartItemRequest();
    dto.productId = productId;
    dto.productOptionId = productOptionId;
    dto.count = count;

    return dto;
  }
}
