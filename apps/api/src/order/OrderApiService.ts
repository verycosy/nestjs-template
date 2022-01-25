import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private async findCartItemsByIds(cartItemIds: number[]): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: {
        id: In(cartItemIds),
      },
      relations: ['product', 'option'],
    });
  }

  private createOrderItemsByCartItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map((cartItem) =>
      OrderItem.create(cartItem.product, cartItem.option, cartItem.quantity),
    );
  }

  async orderFromCart(user: User, cartItemIds: number[]): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: {
        user,
      },
      relations: ['items'],
    });

    if (!cart.hasCartItems(cartItemIds)) {
      return null;
    }

    const cartItems = await this.findCartItemsByIds(cartItemIds);
    const orderItems = this.createOrderItemsByCartItems(cartItems);

    return await this.orderRepository.save(Order.create(orderItems));
  }
}
