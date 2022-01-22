import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartQueryRepository } from '@app/entity/domain/cart/CartQueryRepository';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartApiService {
  constructor(
    @InjectRepository(CartQueryRepository)
    private readonly cartQueryRepository: CartQueryRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private async findCartItemWithUserId(cartItemId: number): Promise<CartItem> {
    return await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .where({ id: cartItemId })
      .leftJoin('cart_item.product', 'product')
      .leftJoin('cart_item.cart', 'cart')
      .leftJoin('cart.user', 'user')
      .select(['cart_item', 'product', 'cart.id', 'user.id'])
      .getOne();
  }

  async addCartItem(
    cart: Cart,
    productId: number,
    count: number,
  ): Promise<CartItem> {
    const product = await this.productRepository.findOne({ id: productId });

    if (!product) {
      return null;
    }

    const cartItem = CartItem.create(cart, product, count);
    return await this.cartItemRepository.save(cartItem);
  }

  async updateCartItemQuantity(
    userId: number,
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.findCartItemWithUserId(cartItemId);

    if (!cartItem || !cartItem.cart.isBelongsTo(userId)) {
      return null;
    }

    cartItem.updateQuantity(quantity);
    return await this.cartItemRepository.save(cartItem);
  }

  async removeCartItem(userId: number, cartItemId: number): Promise<boolean> {
    const cartItem = await this.findCartItemWithUserId(cartItemId);

    if (!cartItem || !cartItem.cart.isBelongsTo(userId)) {
      return false;
    }

    await this.cartItemRepository.remove(cartItem);
    return true;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return await this.cartQueryRepository.getCartItems(cartId);
  }
}
