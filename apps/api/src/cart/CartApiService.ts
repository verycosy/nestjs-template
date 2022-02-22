import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartApiQueryRepository } from './CartApiQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartApiService {
  constructor(
    @InjectRepository(CartApiQueryRepository)
    private readonly cartApiQueryRepository: CartApiQueryRepository,
  ) {}

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return await this.cartApiQueryRepository.getCartItems(cartId);
  }
}
