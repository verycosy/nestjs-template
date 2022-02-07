import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { CartOrderRequest, OrderDto } from '../dto';
import { OrderApiService } from '../OrderApiService';

@AccessTokenGuard()
@Controller('/order')
export class OrderApiController {
  constructor(private readonly orderApiService: OrderApiService) {}

  @Post('/cart/ready')
  async orderFromCartReady(
    @CurrentUser() user: User,
    @Body() body: CartOrderRequest.Ready,
  ) {
    const order = await this.orderApiService.ready(user, body.cartItemIds);

    if (order === null) {
      return ResponseEntity.ERROR_WITH(
        'Cart item not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(order.merchantUid);
  }

  @Post('/cart/complete')
  async orderFromCartComplete(
    @Body() body: CartOrderRequest.Complete,
  ): Promise<ResponseEntity<OrderDto | string>> {
    const { impUid, merchantUid } = body;

    const order = await this.orderApiService.complete(impUid, merchantUid);

    if (order === null) {
      return ResponseEntity.ERROR_WITH('Can not complete payment');
    }

    return ResponseEntity.OK_WITH(new OrderDto(order));
  }
}
