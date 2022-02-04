import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../cart/CartItem.entity';
import { User } from '../user/User.entity';
import { OrderItem } from './OrderItem.entity';

@Entity('order')
export class Order extends BaseTimeEntity {
  @Index({ unique: true })
  @Column()
  merchantUid: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  static generateMerchantUid(): string {
    return uuidv4();
  }

  static create(merchantUid: string, user: User, cartItems: CartItem[]): Order {
    const order = new Order();
    order.merchantUid = merchantUid;
    order.user = user;
    order.items = cartItems.map((cartItem) =>
      OrderItem.createByCartItem(cartItem),
    );

    return order;
  }

  getTotalAmount(): number {
    return this.items.reduce((acc, cur) => (acc += cur.getAmount()), 0);
  }
}
