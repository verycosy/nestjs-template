import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
  TestProductFactory,
  TestCartItemFactory,
  TestProductOptionFactory,
  TestSubCategoryFactory,
} from '.';

export class TestOrderFactory {
  static async create(
    module: TestingModule,
    user: User,
    product?: Product,
    productOption?: ProductOption,
  ) {
    const orderRepository = module.get<Repository<Order>>('OrderRepository');

    const subCategory = await TestSubCategoryFactory.create(module);

    if (!product) {
      product = await TestProductFactory.create(module, subCategory);
    }

    const cartItem = await TestCartItemFactory.create(
      module,
      user.cart,
      product,
      productOption ?? (await TestProductOptionFactory.create(module, product)),
    );

    return await orderRepository.save(Order.create(user, [cartItem]));
  }

  static async createFromCartItems(
    module: TestingModule,
    user: User,
    cartItems: CartItem[],
  ) {
    const orderRepository = module.get<Repository<Order>>('OrderRepository');
    const order = Order.create(user, cartItems);

    return await orderRepository.save(order);
  }
}
