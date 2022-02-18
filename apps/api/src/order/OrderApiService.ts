import { CartService } from '@app/entity/domain/cart/CartService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCompleteFailedError, ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
  ) {}

  private async waitOrder(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.cartService.findCartWithItemsByUser(user);
    const cartItems = cart.items.filter((item) =>
      cartItemIds.includes(item.id),
    );

    const order = Order.create(user, cartItems);
    await this.orderRepository.save(order);
    await this.cartService.cachingOrderedCartItemIds(
      order.merchantUid,
      cartItemIds,
    );

    return order;
  }

  async ready(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.cartService.findCartWithItemsByUser(user);
    if (!cart.hasCartItems(cartItemIds)) {
      return null;
    }

    return this.waitOrder(user, cartItemIds);
  }

  private async acceptOrder(order: Order): Promise<Order> {
    // tx ?
    order.complete();

    await this.orderRepository.save(order);
    await this.cartService.removeOrderedCartItems(order);

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
