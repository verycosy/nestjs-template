import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDocument } from '../payment/Payment.schema';
import { CartOrderService } from './CartOrderService';
import { ForgeryOrderError } from './error/ForgeryOrderError';
import { Order } from './Order.entity';
import { OrderStatus } from './type/OrderStatus';

@Injectable()
export class OrderCompleteService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartOrderService: CartOrderService,
  ) {}

  async findByMerchantUid(merchantUid: string): Promise<Order> {
    return await this.orderRepository.findOneOrFail({
      where: { merchantUid, status: OrderStatus.Ready },
      relations: ['items'],
    });
  }

  async checkAmount(payment: PaymentDocument, order: Order): Promise<void> {
    if (order.isForgery(payment)) {
      await this.orderRepository.remove(order);
      throw new ForgeryOrderError(order.getTotalAmount(), payment.amount);
    }
  }

  async complete(order: Order): Promise<Order> {
    order.complete();
    await this.orderRepository.save(order);
    await this.cartOrderService.complete(order);

    return order;
  }
}
