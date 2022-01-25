import { getConfigModule } from '@app/config';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderApiService } from '../../../../../apps/api/src/order/OrderApiService';
import { OrderApiController } from '../../../../../apps/api/src/order/controller/OrderApiController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import {
  CartOrderRequest,
  OrderDto,
} from '../../../../../apps/api/src/order/dto';
import {
  TestCartItemFactory,
  TestProductFactory,
  TestProductOptionFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { User } from '@app/entity/domain/user/User.entity';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule, SubCategory } from '@app/entity/domain/category';

describe('OrderApiController', () => {
  let sut: OrderApiController;
  let module: TestingModule;
  let user: User, subCategory: SubCategory;

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
      controllers: [OrderApiController],
    }).compile();

    sut = module.get(OrderApiController);

    user = await TestUserFactory.create(module);
    subCategory = await TestSubCategoryFactory.create(module);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('orderFromCart', () => {
    it('장바구니에 담기지 않은 상품을 주문할 경우 not found error response 반환', async () => {
      const dto = CartOrderRequest.create([1, 2, 3, 4]);

      const result = await sut.orderFromCart(user, dto);

      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
      expect(result.message).toBe('Cart item not found');
    });

    it('주문내역 반환', async () => {
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

      const dto = CartOrderRequest.create([1, 2]);

      const result = await sut.orderFromCart(user, dto);

      const data = result.data as OrderDto;
      expect(data).toEqual({
        id: 1,
        status: 'accept',
        items: [
          {
            id: 1,
            quantity: 3,
            optionPrice: 1000,
            optionDetail: 'product option 1',
            productName: 'banana',
          },
          {
            id: 2,
            quantity: 1,
            optionPrice: 1000,
            optionDetail: 'product option 3',
            productName: 'apple',
          },
        ],
      });
    });
  });
});
