import { IsNumber, IsString } from 'class-validator';

export class AddProductOptionRequest {
  @IsString()
  detail: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discount: number;

  static create(
    detail: string,
    price: number,
    discount: number,
  ): AddProductOptionRequest {
    const dto = new AddProductOptionRequest();
    dto.detail = detail;
    dto.price = price;
    dto.discount = discount;

    return dto;
  }
}
