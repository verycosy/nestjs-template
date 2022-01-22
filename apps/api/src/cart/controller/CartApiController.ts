import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { CartApiService } from '../CartApiService';
import { AddCartItemRequest, CartItemDto } from '../dto';

@AccessTokenGuard()
@Controller('/cart')
export class CartApiController {
  constructor(private readonly cartApiService: CartApiService) {}

  @Post()
  async addCartItem(
    @CurrentUser() user: User,
    @Body() body: AddCartItemRequest,
  ): Promise<ResponseEntity<CartItemDto | string>> {
    const { productId, count } = body;

    const cartItem = await this.cartApiService.addCartItem(
      user.cart,
      productId,
      count,
    );

    if (cartItem === null) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new CartItemDto(cartItem));
  }
}
