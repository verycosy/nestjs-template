import { CACHE_SERVICE, CacheService } from '@app/util/cache';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Order } from '../order/Order.entity';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { User } from '../user/User.entity';
import { Cart } from './Cart.entity';
import { CartItem } from './CartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
    @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
  ) {}

  async findCartWithItemsByUser(user: User): Promise<Cart> {
    return await this.cartRepository.findOneOrFail({
      where: {
        user,
      },
      relations: ['items', 'items.product', 'items.option'],
    });
  }

  private async getOrderedCartItemIdsByMerchantUid(
    merchantUid: string,
  ): Promise<number[]> {
    const cartItemIdsString =
      (await this.cacheService.get<string>(merchantUid)) ?? '';

    return cartItemIdsString.split(',').map(Number);
  }

  async removeOrderedCartItems(order: Order): Promise<void> {
    const cartItemIds = await this.getOrderedCartItemIdsByMerchantUid(
      order.merchantUid,
    );

    const cart = await this.findCartWithItemsByUser(await order.user);
    cart.items = cart.items.filter((item) => !cartItemIds.includes(item.id));

    await this.cartRepository.save(cart);
  }

  async cachingOrderedCartItemIds(
    merchantUid: string,
    cartItemIds: number[],
  ): Promise<void> {
    await this.cacheService.set(merchantUid, cartItemIds.join(), {
      ttl: 60 * 15, // 15min
    });
  }

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
}
