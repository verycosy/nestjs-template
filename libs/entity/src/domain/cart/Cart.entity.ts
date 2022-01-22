import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/User.entity';
import { CartItem } from './CartItem.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

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
}
