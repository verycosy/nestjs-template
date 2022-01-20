import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateProductRequest {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  detail: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;

  static create(
    name: string,
    price: number,
    detail: string,
    status: ProductStatus,
  ): UpdateProductRequest {
    const dto = new UpdateProductRequest();
    dto.name = name;
    dto.price = price;
    dto.detail = detail;
    dto.status = status;

    return dto;
  }
}
