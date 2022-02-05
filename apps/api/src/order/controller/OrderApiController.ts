import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { Order } from '@app/entity/domain/order/Order.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { CartOrderRequest, OrderDto } from '../dto';
import { OrderApiService } from '../OrderApiService';

@AccessTokenGuard()
@Controller('/order')
export class OrderApiController {
  constructor(private readonly orderApiService: OrderApiService) {}

  @Post('/cart/ready')
  async orderReady() {
    // TODO: 주문번호 생성할 때 결제할 금액도 미리 저장 (webhook)
    return ResponseEntity.OK_WITH(Order.generateMerchantUid());
  }

  @Post('/cart/complete')
  async orderFromCartComplete(
    @CurrentUser() user: User,
    @Body() body: CartOrderRequest,
  ): Promise<ResponseEntity<OrderDto | string>> {
    const { cartItemIds, impUid, merchantUid } = body;

    const order = await this.orderApiService.orderFromCart(
      user,
      cartItemIds,
      impUid,
      merchantUid,
    );

    if (order === null) {
      return ResponseEntity.ERROR_WITH(
        'Cart item not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new OrderDto(order));
  }
}
