import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './Order.entity';
import { OrderStatus } from './type/OrderStatus';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findOneWithItemsByMerchantUid(merchantUid: string): Promise<Order> {
    return await this.orderRepository.findOneOrFail({
      where: { merchantUid, status: OrderStatus.Ready },
      relations: ['items'],
    });
  }

  async start(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async complete(order: Order): Promise<Order> {
    order.complete();
    return await this.orderRepository.save(order);
  }

  async remove(order: Order): Promise<void> {
    await this.orderRepository.remove(order);
  }
}
