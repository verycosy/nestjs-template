import { getConfigModule } from '@app/config';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import { CategoryModule } from '@app/entity/domain/category';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TestOrderFactory, TestUserFactory } from '@app/util/testing';
import { CartItemFixtureFactory } from '@app/util/testing/CartItemFixtureFactory';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { OrderApiService } from '../../../../../apps/api/src/order/OrderApiService';
import { Repository } from 'typeorm';
import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { ReviewModule } from '@app/entity/domain/review/ReviewModule';
import { iamportPaymentMockData } from '../../../../../libs/entity/test/integration/domain/payment/mockData';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';
import {
  PaymentDocument,
  Payment,
} from '@app/entity/domain/payment/Payment.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CacheService,
  CACHE_SERVICE,
  CustomCacheModule,
} from '@app/util/cache';
import { User } from '@app/entity/domain/user/User.entity';

describe('OrderApiService', () => {
  let sut: OrderApiService;
  let module: TestingModule;
  let cartRepository: Repository<Cart>;
  let paymentRepository: Model<PaymentDocument>;
  let user: User;

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
        ReviewModule,
        PaymentModule,
        CustomCacheModule,
      ],
      providers: [OrderApiService],
    }).compile();

    sut = module.get(OrderApiService);
    cartRepository = module.get('CartRepository');
    paymentRepository = module.get(getModelToken(Payment.name));

    user = await TestUserFactory.create(module);

    jest
      .spyOn(module.get(PaymentService), 'complete')
      .mockResolvedValue(iamportPaymentMockData);
  });

  afterEach(async () => {
    await paymentRepository.deleteMany({});
    await module.close();
  });

  describe('ready', () => {
    it('주문할 장바구니 상품이 없으면 null 반환', async () => {
      const result = await sut.ready(user, [1, 2]);

      expect(result).toBeNull();
    });

    it('결제준비된 주문 객체 반환', async () => {
      await CartItemFixtureFactory.create(module, user);

      const result = await sut.ready(user, [1, 2]);

      expect(result).toMatchObject({
        id: 1,
        items: [
          {
            id: 1,
            quantity: 3,
            optionPrice: 1000,
            optionDetail: 'product option 1',
            optionDiscount: 0,
            productName: 'banana',
            status: 'accept',
          },
          {
            id: 2,
            quantity: 1,
            optionPrice: 1000,
            optionDetail: 'product option 3',
            optionDiscount: 0,
            productName: 'apple',
            status: 'accept',
          },
        ],
      });
    });
  });

  describe('complete', () => {
    it('결제완료할 주문이 없으면 null 반환', async () => {
      const result = await sut.complete('impUid', 'merchantUid');

      expect(result).toBeNull();
    });

    it('결제 완료된 주문 객체 반환', async () => {
      const cartItems = await CartItemFixtureFactory.create(module, user);
      const order = await TestOrderFactory.createFromCartItems(
        module,
        user,
        cartItems,
      );
      jest
        .spyOn(module.get<CacheService>(CACHE_SERVICE), 'get')
        .mockResolvedValue('1,2');

      const result = await sut.complete('impUid', order.merchantUid);

      expect(result.id).toBe(1);
      expect(result.items.length).toBe(2);
      const cart = await cartRepository.findOne({
        where: { user },
        relations: ['items'],
      });
      expect(cart.items.length).toBe(0);
    });
  });
});
