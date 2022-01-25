import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { OrderStatus } from './type/OrderStatus';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

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
