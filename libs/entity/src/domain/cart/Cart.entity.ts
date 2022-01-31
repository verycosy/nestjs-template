import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/User.entity';
import { CartItem } from './CartItem.entity';

@Entity('cart')
export class Cart extends BaseTimeEntity {
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];

  static create(user: User): Cart {
    const cart = new Cart();
    user.cart = cart;

    return cart;
  }

  isBelongsTo(userId: number): boolean {
    return this.user.id === userId;
  }

  hasCartItems(itemIds: number[]): boolean {
    const totalItemIds = this.items.map((cartItem) => cartItem.id);

    const result = itemIds.filter((cartOrderItemId) =>
      totalItemIds.includes(cartOrderItemId),
    ).length;

    return itemIds.length === result;
  }
}
