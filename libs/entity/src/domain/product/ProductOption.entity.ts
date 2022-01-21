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
    productOption.detail = detail;
    productOption.price = price;

    return productOption;
  }
}
