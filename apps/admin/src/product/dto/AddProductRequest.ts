import { IsNumber, IsString } from 'class-validator';

export class AddProductRequest {
  @IsNumber()
  subCategoryId: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  detail: string;

  static create(
    subCategoryId: number,
    name: string,
    price: number,
    detail: string,
  ): AddProductRequest {
    const dto = new AddProductRequest();
    dto.subCategoryId = subCategoryId;
    dto.name = name;
    dto.price = price;
    dto.detail = detail;

    return dto;
  }
}
