import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { OrderStatus } from './type/OrderStatus';

@Entity('order')
export class Order extends BaseTimeEntity {
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Accept,
  })
  private status: OrderStatus;

  static create(items: OrderItem[]): Order {
    const order = new Order();
    order.status = OrderStatus.Accept;
    order.items = items;

    return order;
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
