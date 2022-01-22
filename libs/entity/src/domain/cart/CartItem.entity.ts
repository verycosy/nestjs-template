import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  quantity: number;

  static create(cart: Cart, product: Product, quantity: number): CartItem {
    const cartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.quantity = quantity;

    return cartItem;
  }

  updateQuantity(quantity: number): void {
    this.quantity = quantity;
  }
}
