import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import {
  CancelOrderRequest,
  CartOrderReadyRequest,
  OrderCompleteRequest,
  OrderDto,
  OrderReadyRequest,
} from '../dto';
import { OrderApiService } from '../OrderApiService';
import { OrderCancelApiService } from '../OrderCancelApiService';

@AccessTokenGuard()
@Controller('/order')
export class OrderApiController {
  constructor(
    private readonly orderApiService: OrderApiService,
    private readonly orderCancelApiService: OrderCancelApiService,
  ) {}

  @Post()
  async orderReady(@CurrentUser() user: User, @Body() body: OrderReadyRequest) {
    const order = await this.orderApiService.ready(user, body);
    return ResponseEntity.OK_WITH(order.merchantUid);
  }

  @Post('/cart/ready')
  async orderFromCartReady(
    @CurrentUser() user: User,
    @Body() body: CartOrderReadyRequest,
  ): Promise<ResponseEntity<string>> {
    const order = await this.orderApiService.ready(user, body.cartItemIds);
    return ResponseEntity.OK_WITH(order.merchantUid);
  }

  @Post('/cart/complete')
  async orderFromCartComplete(
    @Body() body: OrderCompleteRequest,
  ): Promise<ResponseEntity<OrderDto | string>> {
    const { impUid, merchantUid } = body;

    try {
      const order = await this.orderApiService.complete(impUid, merchantUid);
      return ResponseEntity.OK_WITH(new OrderDto(order));
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw err;
      }

      return ResponseEntity.ERROR_WITH(err.message);
    }
  }

  @Post('/iamport-webhook')
  async iamportWebhook(
    @Body() body: OrderCompleteRequest,
  ): Promise<ResponseEntity<OrderDto | string>> {
    return await this.orderFromCartComplete(body);
  }

  @Post('/cancel')
  async cancelOrder(@Body() body: CancelOrderRequest) {
    const { merchantUid, reason, orderItemId } = body;
    await this.orderCancelApiService.cancel(merchantUid, orderItemId, reason);
  }
}
