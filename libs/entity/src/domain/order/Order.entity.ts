import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../cart/CartItem.entity';
import { PaymentDocument } from '../payment/Payment.schema';
import { User } from '../user/User.entity';
import { OrderItem } from './OrderItem.entity';
import { OrderStatus } from './type/OrderStatus';

@Entity('order')
export class Order extends BaseTimeEntity {
  @Index({ unique: true })
  @Column()
  merchantUid: string;

  @ManyToOne(() => User)
  user: Promise<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status = OrderStatus.Ready;

  private generateMerchantUid(): string {
    return uuidv4();
  }

  static create(user: User, orderItem: OrderItem): Order;
  static create(user: User, cartItems: CartItem[]): Order;
  static create(user: User, option: OrderItem | CartItem[]): Order {
    const order = new Order();
    order.merchantUid = order.generateMerchantUid();
    order.user = Promise.resolve(user);

    if (option instanceof OrderItem) {
      order.items = [option];
    } else {
      order.items = option.map((cartItem) =>
        OrderItem.createByCartItem(cartItem),
      );
    }

    return order;
  }

  getTotalAmount(): number {
    return this.items.reduce((acc, cur) => (acc += cur.getAmount()), 0);
  }

  isForgery(paymentDocument: PaymentDocument): boolean {
    return paymentDocument.amount !== this.getTotalAmount();
  }

  complete(): void {
    this.status = OrderStatus.Complete;
  }
}
