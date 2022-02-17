import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { IamportPaymentData } from '@app/entity/domain/payment/iamport/types';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { User } from '@app/entity/domain/user/User.entity';
import { CACHE_SERVICE, CacheService } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderCompleteFailedError, ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly paymentService: PaymentService,
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  private async findCartItemsByIds(cartItemIds: number[]): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: {
        id: In(cartItemIds),
      },
      relations: ['product', 'option'],
    });
  }

  private async findCartWithItemsByUser(user: User): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: {
        user,
      },
      relations: ['items'],
    });
  }

  private async getOrderedCartItemIdsByMerchantUid(
    merchantUid: string,
  ): Promise<number[]> {
    const cartItemIdsString =
      (await this.cacheService.get<string>(merchantUid)) ?? '';

    return cartItemIdsString.split(',').map(Number);
  }

  private async removeOrderedCartItems(merchantUid: string): Promise<void> {
    const cartItemIds = await this.getOrderedCartItemIdsByMerchantUid(
      merchantUid,
    );

    const cartItems = await this.findCartItemsByIds(cartItemIds);
    await this.cartItemRepository.remove(cartItems);
  }

  private async waitOrder(user: User, cartItemIds: number[]): Promise<Order> {
    const cartItems = await this.findCartItemsByIds(cartItemIds); // lazy ?

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

  private async acceptOrder(
    order: Order,
    paymentData: IamportPaymentData,
  ): Promise<Order> {
    // tx ?
    order.complete();

    await this.paymentService.save(paymentData);
    await this.orderRepository.save(order);
    await this.removeOrderedCartItems(order.merchantUid);

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
          return await this.acceptOrder(order, paymentData);
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

  async cancel(merchantUid: string, orderItemId: number, reason: string) {
    // TODO: try, tx
    const orderItem = await this.orderItemRepository.findOne({
      id: orderItemId,
    });

    if (!orderItem) {
      return null;
    }

    const canceledPayment = await this.paymentService.cancel(
      merchantUid,
      reason,
      orderItem.getAmount(),
    );

    if (!canceledPayment) {
      return null;
    }

    orderItem.cancel();
    await this.orderItemRepository.save(orderItem);
  }
}
