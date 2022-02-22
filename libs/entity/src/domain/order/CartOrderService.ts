import { CacheService, CACHE_SERVICE } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Cart } from '../cart/Cart.entity';
import { CartItem } from '../cart/CartItem.entity';
import { User } from '../user/User.entity';
import { Order } from './Order.entity';

@Injectable()
export class CartOrderService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  async findCartWithItemsByUser(user: User): Promise<Cart> {
    return await this.cartRepository.findOneOrFail({
      where: {
        user,
      },
      relations: ['items', 'items.product', 'items.option'],
    });
  }

  private async getOrderedCartItemIdsByMerchantUid(
    merchantUid: string,
  ): Promise<number[]> {
    const cartItemIdsString =
      (await this.cacheService.get<string>(merchantUid)) ?? '';

    return cartItemIdsString.split(',').map(Number);
  }

  async removeOrderedCartItems(order: Order): Promise<void> {
    const cartItemIds = await this.getOrderedCartItemIdsByMerchantUid(
      order.merchantUid,
    );

    const cart = await this.findCartWithItemsByUser(await order.user);
    cart.items = cart.items.filter((item) => !cartItemIds.includes(item.id));

    await this.cartRepository.save(cart);
  }

  async cachingOrderedCartItemIds(
    merchantUid: string,
    cartItemIds: number[],
  ): Promise<void> {
    await this.cacheService.set(merchantUid, cartItemIds.join(), {
      ttl: 60 * 15, // 15min
    });
  }

  async ready(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.findCartWithItemsByUser(user);
    if (!cart.hasCartItems(cartItemIds)) {
      throw new EntityNotFoundError(CartItem, { ids: cartItemIds });
    }

    const orderedCartItems = cart.items.filter((item) =>
      cartItemIds.includes(item.id),
    );

    const order = Order.create(user, orderedCartItems);
    await this.cachingOrderedCartItemIds(order.merchantUid, cartItemIds);

    return order;
  }

  async complete(order: Order) {
    await this.removeOrderedCartItems(order);
  }
}
