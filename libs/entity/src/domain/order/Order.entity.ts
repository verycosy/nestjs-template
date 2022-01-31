import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/User.entity';
import { OrderItem } from './OrderItem.entity';
import { OrderStatus } from './type/OrderStatus';

@Entity('order')
export class Order extends BaseTimeEntity {
  @ManyToOne(() => User)
  user: User;

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

  static create(user: User, items: OrderItem[]): Order {
    const order = new Order();
    order.user = user;
    order.status = OrderStatus.Accept;
    order.items = items;

    return order;
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
