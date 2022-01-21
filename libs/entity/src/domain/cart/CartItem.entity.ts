import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/Product.entity';
import { Cart } from './Cart.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;
}
