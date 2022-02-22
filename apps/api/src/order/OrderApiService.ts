import { CartOrderService } from '@app/entity/domain/order/CartOrderService';
import { ForgeryOrderError } from '@app/entity/domain/order/error/ForgeryOrderError';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderCancelService } from '@app/entity/domain/order/OrderCancelService';
import { OrderCompleteService } from '@app/entity/domain/order/OrderCompleteService';
import { SingleOrderService } from '@app/entity/domain/order/SingleOrderService';
import { SingleOrderDto } from '@app/entity/domain/order/type/SingleOrderDto';
import {
  PaymentService,
  PaymentCompleteFailedError,
} from '@app/entity/domain/payment';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderApiService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly singleOrderService: SingleOrderService,
    private readonly cartOrderService: CartOrderService,
    private readonly orderCompleteService: OrderCompleteService,
    private readonly orderCancelService: OrderCancelService,
  ) {}

  async ready(user: User, option: number[] | SingleOrderDto): Promise<Order> {
    if (option instanceof SingleOrderDto) {
      return await this.singleOrderService.ready(user, option);
    } else {
      return await this.cartOrderService.ready(user, option);
    }
  }

  async complete(impUid: string, merchantUid: string): Promise<Order> {
    const order = await this.orderCompleteService.findByMerchantUid(
      merchantUid,
    );

    try {
      const payment = await this.paymentService.complete(impUid);
      await this.orderCompleteService.checkAmount(payment, order);

      switch (payment.status) {
        case 'paid': // tx ?
          return this.orderCompleteService.complete(order);
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

  async cancel(
    merchantUid: string,
    orderItemId: number,
    reason: string,
  ): Promise<void> {
    const orderItem = await this.orderCancelService.findOrderItemById(
      orderItemId,
    );

    await this.paymentService.cancel(
      merchantUid,
      reason,
      orderItem.getAmount(),
    );

    await this.orderCancelService.cancel(orderItem);
  }
}
