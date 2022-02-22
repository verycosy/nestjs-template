import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './OrderItem.entity';

@Injectable()
export class OrderCancelService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findOrderItemById(id: number): Promise<OrderItem> {
    return await this.orderItemRepository.findOneOrFail({
      id,
    });
  }

  async cancel(orderItem: OrderItem) {
    orderItem.cancel();
    await this.orderItemRepository.save(orderItem);
  }
}
