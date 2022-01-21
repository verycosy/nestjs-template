import { PageRequest } from '@app/config/PageRequest';
import { IsNumber, IsOptional } from 'class-validator';

export class GetProductsRequest extends PageRequest {
  @IsOptional()
  @IsNumber()
  subCategoryId?: number;

  hasSubCategoryId(): boolean {
    return this.subCategoryId !== undefined;
  }

  static create(
    pageNo: number,
    pageSize: number,
    subCategoryId?: number,
  ): GetProductsRequest {
    const dto = new GetProductsRequest();
    dto.pageNo = pageNo;
    dto.pageSize = pageSize;
    dto.subCategoryId = subCategoryId;

    return dto;
  }
}
