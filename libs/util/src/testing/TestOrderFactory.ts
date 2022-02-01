import { Order } from '@app/entity/domain/order/Order.entity';
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
  static async create(module: TestingModule, user: User) {
    const orderRepository = module.get<Repository<Order>>('OrderRepository');

    const subCategory = await TestSubCategoryFactory.create(module);
    const product = await TestProductFactory.create(module, subCategory);
    const productOption = await TestProductOptionFactory.create(
      module,
      product,
    );
    const cartItem = await TestCartItemFactory.create(
      module,
      user.cart,
      product,
      productOption,
    );

    return await orderRepository.save(Order.create(user, [cartItem]));
  }
}
