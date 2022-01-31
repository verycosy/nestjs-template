import { SubCategoryDto } from '@app/entity/domain/category/dto/SubCategoryDto';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

export class ProductDto {
  constructor(entity: Product) {
    this.id = entity.id;
    this.name = entity.name;
    this.detail = entity.detail;
    this.price = entity.price;
    this.status = entity.status;
    this.subCategory = new SubCategoryDto(entity.subCategory);
  }

  private readonly id: number;
  private readonly name: string;
  private readonly detail: string;
  private readonly price: number;
  private readonly status: ProductStatus;
  private readonly subCategory: SubCategoryDto;
}
