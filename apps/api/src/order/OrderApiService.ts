import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartService } from '@app/entity/domain/cart/CartService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderService } from '@app/entity/domain/order/OrderService';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { Product } from '@app/entity/domain/product/Product.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { OrderReadyRequest } from './dto';
import { ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async ready(user: User, dto: OrderReadyRequest): Promise<Order>;
  async ready(user: User, cartItemIds: number[]): Promise<Order>;
  async ready(
    user: User,
    option: number[] | OrderReadyRequest,
  ): Promise<Order> {
    if (option instanceof OrderReadyRequest) {
      const { productId, productOptionId, quantity } = option;
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.options', 'options')
        .where({ id: productId })
        .andWhere('options.id = :optionId', { optionId: productOptionId })
        .getOneOrFail();

      const orderItem = OrderItem.create(product, product.options[0], quantity);

      const order = await this.orderService.start(
        Order.create(user, orderItem),
      );
      return order;
    } else {
      const cart = await this.cartService.findCartWithItemsByUser(user);
      if (!cart.hasCartItems(option)) {
        throw new EntityNotFoundError(CartItem, { ids: option });
      }

      const order = await this.orderService.start(
        Order.create(
          user,
          cart.items.filter((item) => option.includes(item.id)),
        ),
      );

      await this.cartService.cachingOrderedCartItemIds(
        order.merchantUid,
        option,
      );

      return order;
    }
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
