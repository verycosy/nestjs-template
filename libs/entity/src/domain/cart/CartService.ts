import { CACHE_SERVICE, CacheService } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/Order.entity';
import { User } from '../user/User.entity';
import { Cart } from './Cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  async findCartWithItemsByUser(user: User): Promise<Cart> {
    return await this.cartRepository.findOne({
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
}
