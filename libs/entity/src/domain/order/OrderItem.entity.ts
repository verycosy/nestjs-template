import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { Order } from './Order.entity';
import { OrderItemStatus } from './type/OrderItemStatus';

@Entity('order_item')
export class OrderItem extends BaseTimeEntity {
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

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Accept,
  })
  private status: OrderItemStatus;

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
    orderItem.status = OrderItemStatus.Accept;

    return orderItem;
  }

  getStatus(): OrderItemStatus {
    return this.status;
  }

  getProductName(): string {
    return this.productName;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getOptionPrice(): number {
    return this.optionPrice;
  }

  getOptionDetail(): string {
    return this.optionDetail;
  }
}
