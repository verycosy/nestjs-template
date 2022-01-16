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
    product.update(name, price, detail, ProductStatus.SELL);

    return product;
  }

  update(
    name: string,
    price: number,
    detail: string,
    status: ProductStatus,
  ): void {
    this.name = name;
    this.price = price;
    this.detail = detail;
    this.status = status;
  }
}
