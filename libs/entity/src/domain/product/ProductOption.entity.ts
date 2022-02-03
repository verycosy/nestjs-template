import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './Product.entity';

@Entity('product_option')
export class ProductOption extends BaseTimeEntity {
  @Column()
  detail: string;

  @Column()
  price: number;

  @Column({
    default: 0,
  })
  discount: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  static create(
    detail: string,
    price: number,
    discount: number,
  ): ProductOption {
    const productOption = new ProductOption();
    productOption.update(detail, price, discount);

    return productOption;
  }

  update(detail: string, price: number, discount = 0): void {
    this.detail = detail;
    this.price = price;
    this.discount = discount;
  }
}
