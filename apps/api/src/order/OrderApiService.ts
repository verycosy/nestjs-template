import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartService } from '@app/entity/domain/cart/CartService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { OrderReadyRequest } from './dto';
import { ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private async findProductAndOptionForOrderReady(
    param: OrderReadyRequest,
  ): Promise<[Product, ProductOption]> {
    const { productId, productOptionId } = param;

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.options', 'options')
      .where({ id: productId })
      .andWhere('options.id = :optionId', { optionId: productOptionId })
      .getOneOrFail();

    return [product, product.options[0]];
  }

  async ready(user: User, dto: OrderReadyRequest): Promise<Order>;
  async ready(user: User, cartItemIds: number[]): Promise<Order>;
  async ready(
    user: User,
    option: number[] | OrderReadyRequest,
  ): Promise<Order> {
    let order: Order = null;

    if (option instanceof OrderReadyRequest) {
      const [product, productOption] =
        await this.findProductAndOptionForOrderReady(option);

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

    return await this.orderRepository.save(order);
  }

  async complete(impUid: string, merchantUid: string): Promise<Order> {
    const order = await this.orderRepository.findOneOrFail({
      where: { merchantUid, status: OrderStatus.Ready },
      relations: ['items'],
    });

    try {
      const paymentData = await this.paymentService.complete(impUid);

      if (order.isForgery(paymentData)) {
        await this.orderRepository.remove(order);
        throw new ForgeryOrderError(order.getTotalAmount(), paymentData.amount);
      }

      switch (paymentData.status) {
        case 'paid': // tx ?
          order.complete();
          await this.orderRepository.save(order);
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
