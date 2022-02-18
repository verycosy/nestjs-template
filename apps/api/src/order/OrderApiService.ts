import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { User } from '@app/entity/domain/user/User.entity';
import { CACHE_SERVICE, CacheService } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCompleteFailedError, ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService,
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  private async findCartWithItemsByUser(user: User): Promise<Cart> {
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

  private async removeOrderedCartItems(order: Order): Promise<void> {
    const cartItemIds = await this.getOrderedCartItemIdsByMerchantUid(
      order.merchantUid,
    );

    const cart = await this.findCartWithItemsByUser(await order.user);
    cart.items = cart.items.filter((item) => !cartItemIds.includes(item.id));

    await this.cartRepository.save(cart);
  }

  private async waitOrder(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.findCartWithItemsByUser(user);
    const cartItems = cart.items.filter((item) =>
      cartItemIds.includes(item.id),
    );

    const order = Order.create(user, cartItems);
    await this.orderRepository.save(order);
    await this.cacheService.set(order.merchantUid, cartItemIds.join(), {
      ttl: 60 * 15, // 15min
    });

    return order;
  }

  async ready(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.findCartWithItemsByUser(user);
    if (!cart.hasCartItems(cartItemIds)) {
      return null;
    }

    return this.waitOrder(user, cartItemIds);
  }

  private async acceptOrder(order: Order): Promise<Order> {
    // tx ?
    order.complete();

    await this.orderRepository.save(order);
    await this.removeOrderedCartItems(order);

    return order;
  }

  async complete(impUid: string, merchantUid: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { merchantUid, status: OrderStatus.Ready },
      relations: ['items'],
    });

    if (!order) {
      return null;
    }

    try {
      const paymentData = await this.paymentService.complete(impUid);

      if (order.isForgery(paymentData)) {
        await this.orderRepository.remove(order);
        throw new ForgeryOrderError(order.getTotalAmount(), paymentData.amount);
      }

      switch (paymentData.status) {
        case 'paid':
          return await this.acceptOrder(order);
        default:
          throw new OrderCompleteFailedError();
      }
    } catch (err) {
      if (
        err instanceof ForgeryOrderError ||
        err instanceof OrderCompleteFailedError
      ) {
        await this.paymentService.cancel(impUid, err.message);
      }
      throw err;
    }
  }
}
