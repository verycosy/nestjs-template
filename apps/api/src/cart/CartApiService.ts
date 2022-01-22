import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartApiService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addCartItem(cart: Cart, productId: number, count: number) {
    const product = await this.productRepository.findOne({ id: productId });

    if (!product) {
      return null;
    }

    const cartItem = CartItem.create(cart, product, count);
    return await this.cartItemRepository.save(cartItem);
  }
}
