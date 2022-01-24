import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { Order } from './Order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Product)
  private product: Product;

  @ManyToOne(() => ProductOption)
  private option: ProductOption;

  @Column()
  private productName: string;

  @Column()
  private optionDetail: string;

  @Column()
  private optionPrice: number;

  @Column()
  private quantity: number;

  static create(
    product: Product,
    option: ProductOption,
    quantity: number,
  ): OrderItem {
    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.option = option;
    orderItem.productName = product.name;
    orderItem.optionDetail = option.detail;
    orderItem.optionPrice = option.price;
    orderItem.quantity = quantity;

    return orderItem;
  }

  getTotalPrice(): number {
    return this.optionPrice * this.quantity;
  }
}
