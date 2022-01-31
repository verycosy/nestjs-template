import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { TestProductFactory } from '.';
import { TestCartItemFactory } from './TestCartItemFactory';
import { TestProductOptionFactory } from './TestProductOptionFactory';
import { TestSubCategoryFactory } from './TestSubCategoryFactory';

export class CartItemFixtureFactory {
  static async create(module: TestingModule, user: User) {
    const subCategory = await TestSubCategoryFactory.create(module);

    const product1 = await TestProductFactory.create(module, subCategory);
    const product2 = await TestProductFactory.create(module, subCategory, {
      name: 'apple',
      detail: 'delicious',
      price: 6000,
    });

    const productOption1 = await TestProductOptionFactory.create(
      module,
      product1,
      1000,
      'product option 1',
    );

    const productOption2 = await TestProductOptionFactory.create(
      module,
      product1,
      2000,
      'product option 2',
    );

    const productOption3 = await TestProductOptionFactory.create(
      module,
      product2,
      1000,
      'product option 3',
    );

    await TestCartItemFactory.create(
      module,
      user.cart,
      product1,
      productOption1,
      3,
    );

    await TestCartItemFactory.create(
      module,
      user.cart,
      product2,
      productOption3,
      1,
    );
  }
}
