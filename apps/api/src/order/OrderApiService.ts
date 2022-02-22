import { CartOrderService } from '@app/entity/domain/order/CartOrderService';
import { Order } from '@app/entity/domain/order/Order.entity';
import { SingleOrderService } from '@app/entity/domain/order/SingleOrderService';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { SingleOrderDto } from '@app/entity/domain/order/type/SingleOrderDto';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgeryOrderError } from './error';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService,
    private readonly singleOrderService: SingleOrderService,
    private readonly cartOrderService: CartOrderService,
  ) {}

  async ready(user: User, option: number[] | SingleOrderDto): Promise<Order> {
    if (option instanceof SingleOrderDto) {
      return await this.singleOrderService.ready(user, option);
    } else {
      return await this.cartOrderService.ready(user, option);
    }
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
          await this.cartOrderService.complete(order);

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
