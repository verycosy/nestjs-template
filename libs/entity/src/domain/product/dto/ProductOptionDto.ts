import { ProductOption } from '../ProductOption.entity';

export class ProductOptionDto {
  constructor(entity: ProductOption) {
    this.id = entity.id;
    this.price = entity.price;
    this.detail = entity.detail;
  }

  private readonly id: number;
  private readonly price: number;
  private readonly detail: string;
}
