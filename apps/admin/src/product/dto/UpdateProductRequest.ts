import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import { IsEnum } from 'class-validator';
import { AddProductRequest } from '.';

export class UpdateProductRequest extends AddProductRequest {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
