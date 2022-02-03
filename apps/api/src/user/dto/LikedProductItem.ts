import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

export class LikedProductItem {
  constructor(entity: Product) {
    this.id = entity.id;
    this.name = entity.name;
    this.price = entity.price;
    this.status = entity.status;
  }

  id: number;
  name: string;
  price: number;
  status: ProductStatus;
}
