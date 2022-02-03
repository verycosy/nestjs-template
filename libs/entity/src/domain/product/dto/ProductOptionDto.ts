import { ProductOption } from '../ProductOption.entity';

export class ProductOptionDto {
  constructor(entity: ProductOption) {
    this.id = entity.id;
    this.price = entity.price;
    this.detail = entity.detail;
    this.discount = entity.discount;
  }

  readonly id: number;
  readonly price: number;
  readonly detail: string;
  readonly discount: number;
}
