import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { Cart } from './Cart.entity';

@Entity('cart_item')
export class CartItem extends BaseTimeEntity {
  @ManyToOne(() => Cart)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => ProductOption)
  option: ProductOption;

  @Column()
  quantity: number;

  static create(
    cart: Cart,
    product: Product,
    option: ProductOption,
    quantity: number,
  ): CartItem {
    const cartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.option = option;
    cartItem.quantity = quantity;

    return cartItem;
  }

  updateQuantity(quantity: number): void {
    this.quantity = quantity;
  }
}
