import { IsNumber, IsString } from 'class-validator';

export class AddProductRequest {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  detail: string;

  static create(
    name: string,
    price: number,
    detail: string,
  ): AddProductRequest {
    const dto = new AddProductRequest();
    dto.name = name;
    dto.price = price;
    dto.detail = detail;

    return dto;
  }
}
