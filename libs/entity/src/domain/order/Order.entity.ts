import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart/CartItem.entity';
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

  static create(user: User, cartItems: CartItem[]): Order {
    const order = new Order();
    order.user = user;
    order.items = cartItems.map((cartItem) =>
      OrderItem.createByCartItem(cartItem),
    );

    return order;
  }
}
