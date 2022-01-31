import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/User.entity';
import { OrderItem } from './OrderItem.entity';

@Entity('order')
export class Order extends BaseTimeEntity {
  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  static create(user: User, items: OrderItem[]): Order {
    const order = new Order();
    order.user = user;
    order.items = items;

    return order;
  }
}
