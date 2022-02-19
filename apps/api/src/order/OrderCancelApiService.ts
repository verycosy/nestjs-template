import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderCancelApiService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly paymentService: PaymentService,
  ) {}

  async cancel(merchantUid: string, orderItemId: number, reason: string) {
    // TODO: try, tx
    const orderItem = await this.orderItemRepository.findOneOrFail({
      id: orderItemId,
    });

    await this.paymentService.cancel(
      merchantUid,
      reason,
      orderItem.getAmount(),
    );

    orderItem.cancel();
    await this.orderItemRepository.save(orderItem);
  }
}
