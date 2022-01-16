import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductStatus } from './type/ProductStatus';

@Entity('product')
export class Product {
  private constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({
    type: 'text',
  })
  detail: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.SELL,
  })
  status: ProductStatus;

  static create(name: string, price: number, detail: string): Product {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.detail = detail;

    return product;
  }
}
