import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { CartService } from '@app/entity/domain/cart/CartService';
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
  constructor(
    private readonly cartApiService: CartApiService,
    private readonly cartService: CartService,
  ) {}

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
  ): Promise<ResponseEntity<CartItemDto>> {
    const { productId, productOptionId, count } = body;

    const cartItem = await this.cartService.addCartItem(
      user.cart,
      productId,
      productOptionId,
      count,
    );

    return ResponseEntity.OK_WITH(new CartItemDto(cartItem));
  }

  @Patch('/:cartItemId')
  async updateCartItemQuantity(
    @CurrentUser() user: User,
    @Param('cartItemId') cartItemId: number,
    @Body() body: UpdateCartItemQuantityRequest,
  ): Promise<ResponseEntity<CartItemDto>> {
    const cartItem = await this.cartService.updateCartItemQuantity(
      user.id,
      cartItemId,
      body.quantity,
    );

    return ResponseEntity.OK_WITH(new CartItemDto(cartItem));
  }

  @Delete('/:cartItemId')
  async removeCartItem(
    @CurrentUser() user: User,
    @Param('cartItemId') cartItemId: number,
  ): Promise<ResponseEntity<string>> {
    await this.cartService.removeCartItem(user.id, cartItemId);
    return ResponseEntity.OK();
  }
}
