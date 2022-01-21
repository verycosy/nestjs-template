import { IsNumber, IsString } from 'class-validator';

export class AddProductOptionRequest {
  @IsString()
  detail: string;

  @IsNumber()
  price: number;

  static create(detail: string, price: number): AddProductOptionRequest {
    const dto = new AddProductOptionRequest();
    dto.detail = detail;
    dto.price = price;

    return dto;
  }
}
