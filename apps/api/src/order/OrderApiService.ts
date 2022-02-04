import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import {
  Payment,
  PaymentDocument,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly paymentService: PaymentService,
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

  async orderFromCart(
    user: User,
    cartItemIds: number[],
    impUid: string,
    merchantUid: string,
  ): Promise<Order> {
    try {
      const cart = await this.findCartWithItemsByUser(user);
      if (!cart.hasCartItems(cartItemIds)) {
        return null;
      }

      const { code, message, response } = await this.paymentService.complete(
        impUid,
      );

      const cartItems = await this.findCartItemsByIds(cartItemIds); // lazy ?
      const order = Order.create(merchantUid, user, cartItems);
      if (response.amount !== order.getTotalAmount()) {
        throw new Error();
      }

      switch (response.status) {
        case 'paid': {
          const payment = new this.paymentModel(response);
          await payment.save();

          // tx start ?
          await this.orderRepository.save(order);
          await this.cartItemRepository.remove(cartItems);
          // tx end
          return order;
        }
        default:
          // 결제 취소? payment  삭제?
          throw new Error();
      }
    } catch (err) {
      // 결제 완료 에러
    }
  }
}
