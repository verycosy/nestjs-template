import { AbstractRepository, EntityRepository } from 'typeorm';
import { Cart } from './Cart.entity';
import { CartItem } from './CartItem.entity';

@EntityRepository(Cart)
export class CartQueryRepository extends AbstractRepository<Cart> {
  async getCartItems(cartId: number): Promise<CartItem[]> {
    const cart = await this.createQueryBuilder('cart')
      .where({ id: cartId })
      .leftJoin('cart.items', 'items')
      .leftJoin('items.product', 'product')
      .leftJoin('items.option', 'option')
      .select(['cart', 'items', 'product', 'option'])
      .orderBy({
        'items.id': 'DESC',
      })
      .getOne();

    return cart.items;
  }
}
