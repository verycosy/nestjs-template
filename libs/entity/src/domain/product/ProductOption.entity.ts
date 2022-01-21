import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('product_option')
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  detail: string;

  @Column()
  price: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  static create(detail: string, price: number): ProductOption {
    const productOption = new ProductOption();
    productOption.update(detail, price);

    return productOption;
  }

  update(detail: string, price: number): void {
    this.detail = detail;
    this.price = price;
  }
}
