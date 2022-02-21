import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { CartApiQueryRepository } from './CartApiQueryRepository';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class CartApiService {
  constructor(
    @InjectRepository(CartApiQueryRepository)
    private readonly cartApiQueryRepository: CartApiQueryRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
  ) {}

  private async findCartItemWithUserId(cartItemId: number): Promise<CartItem> {
    return await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .where({ id: cartItemId })
      .leftJoin('cart_item.product', 'product')
      .leftJoin('cart_item.cart', 'cart')
      .leftJoin('cart_item.option', 'option')
      .leftJoin('cart.user', 'user')
      .select(['cart_item', 'product', 'cart.id', 'user.id', 'option'])
      .getOneOrFail();
  }

  async addCartItem(
    cart: Cart,
    productId: number,
    productOptionId: number,
    count: number,
  ): Promise<CartItem> {
    const product = await this.productRepository.findOneOrFail({
      id: productId,
    });
    const productOption = await this.productOptionRepository.findOneOrFail({
      id: productOptionId,
    });

    const cartItem = CartItem.create(cart, product, productOption, count);
    return await this.cartItemRepository.save(cartItem);
  }

  async updateCartItemQuantity(
    userId: number,
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.findCartItemWithUserId(cartItemId);

    if (!cartItem.cart.isBelongsTo(userId)) {
      throw new EntityNotFoundError(CartItem, { id: cartItemId });
    }

    cartItem.updateQuantity(quantity);
    return await this.cartItemRepository.save(cartItem);
  }

  async removeCartItem(userId: number, cartItemId: number): Promise<void> {
    const cartItem = await this.findCartItemWithUserId(cartItemId);

    if (!cartItem.cart.isBelongsTo(userId)) {
      throw new EntityNotFoundError(CartItem, { userId, cartItemId });
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return await this.cartApiQueryRepository.getCartItems(cartId);
  }
}
