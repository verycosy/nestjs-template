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

describe('OrderApiService', () => {
  let sut: OrderApiService;
  let module: TestingModule;
  let cartRepository: Repository<Cart>;
  let paymentRepository: Model<PaymentDocument>;

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
      ],
      providers: [OrderApiService],
    }).compile();

    sut = module.get(OrderApiService);
    cartRepository = module.get('CartRepository');
    paymentRepository = module.get(getModelToken(Payment.name));

    jest
      .spyOn(module.get(PaymentService), 'complete')
      .mockResolvedValue(iamportPaymentMockData);
  });

  afterEach(async () => {
    await paymentRepository.deleteMany({});
    await module.close();
  });

  it('orderFromCart', async () => {
    const user = await TestUserFactory.create(module);
    await CartItemFixtureFactory.create(module, user);

    const result = await sut.orderFromCart(
      user,
      [1, 2],
      'impUid',
      'merchantUid',
    );

    expect(result.id).toBe(1);
    expect(result.items.length).toBe(2);
    const cart = await cartRepository.findOne({
      where: { user },
      relations: ['items'],
    });
    expect(cart.items.length).toBe(0);
  });
});
