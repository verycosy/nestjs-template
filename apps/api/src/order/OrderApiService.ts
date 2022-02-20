import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartService } from '@app/entity/domain/cart/CartService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderService } from '@app/entity/domain/order/OrderService';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { ProductQueryRepository } from '@app/entity/domain/product/ProductQueryRepository';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';
import { OrderReadyRequest } from './dto';
import { ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    @InjectRepository(ProductQueryRepository)
    private readonly productQueryRepository: ProductQueryRepository,
  ) {}

  async ready(user: User, dto: OrderReadyRequest): Promise<Order>;
  async ready(user: User, cartItemIds: number[]): Promise<Order>;
  async ready(
    user: User,
    option: number[] | OrderReadyRequest,
  ): Promise<Order> {
    let order: Order = null;

    if (option instanceof OrderReadyRequest) {
      const [product, productOption] =
        await this.productQueryRepository.findProductAndOptionForOrderReady(
          option,
        );

      const orderItem = OrderItem.create(
        product,
        productOption,
        option.quantity,
      );

      order = Order.create(user, orderItem);
    } else {
      const cart = await this.cartService.findCartWithItemsByUser(user);
      if (!cart.hasCartItems(option)) {
        throw new EntityNotFoundError(CartItem, { ids: option });
      }

      const orderedCartItems = cart.items.filter((item) =>
        option.includes(item.id),
      );

      order = Order.create(user, orderedCartItems);
      await this.cartService.cachingOrderedCartItemIds(
        order.merchantUid,
        option,
      );
    }

    return await this.orderService.start(order);
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
