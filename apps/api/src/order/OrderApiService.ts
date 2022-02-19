import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartService } from '@app/entity/domain/cart/CartService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderService } from '@app/entity/domain/order/OrderService';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
  ) {}

  async ready(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.cartService.findCartWithItemsByUser(user);
    if (!cart.hasCartItems(cartItemIds)) {
      throw new EntityNotFoundError(CartItem, { ids: cartItemIds });
    }

    const order = await this.orderService.start(
      user,
      cart.items.filter((item) => cartItemIds.includes(item.id)),
    );

    await this.cartService.cachingOrderedCartItemIds(
      order.merchantUid,
      cartItemIds,
    );

    return order;
  }

  async complete(impUid: string, merchantUid: string): Promise<Order> {
    const order = await this.orderService.findOneWithItemsByMerchantUid(
      merchantUid,
    );

    try {
      const paymentData = await this.paymentService.complete(impUid);

      if (order.isForgery(paymentData)) {
        await this.orderService.remove(order);
        throw new ForgeryOrderError(order.getTotalAmount(), paymentData.amount);
      }

      switch (paymentData.status) {
        case 'paid': // tx ?
          await this.orderService.complete(order);
          await this.cartService.removeOrderedCartItems(order);
          return order;
        default:
          throw new PaymentCompleteFailedError();
      }
    } catch (err) {
      if (
        err instanceof ForgeryOrderError ||
        err instanceof PaymentCompleteFailedError
      ) {
        await this.paymentService.cancel(impUid, err.message);
      }
      throw err;
    }
  }
}
