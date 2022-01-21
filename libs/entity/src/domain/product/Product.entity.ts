import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubCategory } from '../category';
import { ProductOption } from './ProductOption.entity';
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

  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'sub_category_id', referencedColumnName: 'id' })
  subCategory: SubCategory;

  @OneToMany(() => ProductOption, (productOption) => productOption.product, {
    cascade: ['insert'],
  })
  options: ProductOption[];

  static create(
    subCategory: SubCategory,
    name: string,
    price: number,
    detail: string,
  ): Product {
    const product = new Product();
    product.update(subCategory, name, price, detail, ProductStatus.SELL);

    return product;
  }

  update(
    subCategory: SubCategory,
    name: string,
    price: number,
    detail: string,
    status: ProductStatus,
  ): void {
    this.name = name;
    this.price = price;
    this.detail = detail;
    this.status = status;
    this.subCategory = subCategory;
  }

  addOption(detail: string, price: number): ProductOption {
    const productOption = ProductOption.create(detail, price);

    if (!Array.isArray(this.options)) {
      this.options = [];
    }

    this.options.push(productOption);

    return productOption;
  }
}
