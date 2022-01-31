import { getConfigModule } from '@app/config';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import { CategoryModule } from '@app/entity/domain/category';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TestUserFactory } from '@app/util/testing';
import { CartItemFixtureFactory } from '@app/util/testing/CartItemFixtureFactory';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { OrderApiService } from '../../../../../apps/api/src/order/OrderApiService';
import { Repository } from 'typeorm';
import { Cart } from '@app/entity/domain/cart/Cart.entity';

describe('OrderApiService', () => {
  let sut: OrderApiService;
  let module: TestingModule;
  let cartRepository: Repository<Cart>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        UserModule,
        CartModule,
        ProductModule,
        OrderModule,
        CategoryModule,
      ],
      providers: [OrderApiService],
    }).compile();

    sut = module.get(OrderApiService);
    cartRepository = module.get('CartRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('orderFromCart', async () => {
    const user = await TestUserFactory.create(module);
    await CartItemFixtureFactory.create(module, user);

    const result = await sut.orderFromCart(user, [1, 2]);

    expect(result.id).toBe(1);
    expect(result.getStatus()).toBe('accept');
    expect(result.items.length).toBe(2);
    const cart = await cartRepository.findOne({
      where: { user },
      relations: ['items'],
    });
    expect(cart.items.length).toBe(0);
  });
});
