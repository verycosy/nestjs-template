import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { User } from '@app/entity/domain/user/User.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartApiService } from '../CartApiService';
import { AddCartItemRequest, CartItemDto } from '../dto';
import { UpdateCartItemQuantityRequest } from '../dto/UpdateCartItemQuantityRequest';

@AccessTokenGuard()
@Controller('/cart')
export class CartApiController {
  constructor(private readonly cartApiService: CartApiService) {}

  @Get()
  async getCartItems(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<CartItemDto[]>> {
    const cartItems = await this.cartApiService.getCartItems(user.cart.id);

    return ResponseEntity.OK_WITH(
      cartItems.map((cartItem) => new CartItemDto(cartItem)),
    );
  }

  @Post()
  async addCartItem(
    @CurrentUser() user: User,
    @Body() body: AddCartItemRequest,
  ): Promise<ResponseEntity<CartItemDto | string>> {
    const { productId, productOptionId, count } = body;

    const cartItem = await this.cartApiService.addCartItem(
      user.cart,
      productId,
      productOptionId,
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

  @Patch('/:cartItemId')
  async updateCartItemQuantity(
    @CurrentUser() user: User,
    @Param('cartItemId') cartItemId: number,
    @Body() body: UpdateCartItemQuantityRequest,
  ) {
    const cartItem = await this.cartApiService.updateCartItemQuantity(
      user.id,
      cartItemId,
      body.quantity,
    );

    if (cartItem === null) {
      return ResponseEntity.ERROR_WITH(
        'Cart item not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new CartItemDto(cartItem));
  }

  @Delete('/:cartItemId')
  async removeCartItem(
    @CurrentUser() user: User,
    @Param('cartItemId') cartItemId: number,
  ) {
    const removed = await this.cartApiService.removeCartItem(
      user.id,
      cartItemId,
    );

    if (!removed) {
      return ResponseEntity.ERROR_WITH(
        'Cart item not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK();
  }
}