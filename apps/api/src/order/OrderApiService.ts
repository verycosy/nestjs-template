import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { IamportPaymentData } from '@app/entity/domain/payment/iamport/types';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { User } from '@app/entity/domain/user/User.entity';
import { CACHE_SERVICE, CacheService } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
    await this.paymentService.save(paymentData);
    await this.orderRepository.save(order);
    await this.removeOrderedCartItems(order.merchantUid);

    return order;
  }

  async complete(impUid: string, merchantUid: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { merchantUid },
      relations: ['items'],
    });

    if (!order) {
      return null;
    }

    try {
      const paymentData = await this.paymentService.complete(impUid);
      if (paymentData.amount !== order.getTotalAmount()) {
        throw { status: 'forgery', message: '위조된 결제시도' };
      }

      switch (paymentData.status) {
        case 'paid':
          return await this.acceptOrder(order, paymentData);
        default:
          throw new Error(); // 결제 취소? payment  삭제?
      }
    } catch (err) {
      // 결제 완료 에러
    }
  }
}
