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
import { TestUserFactory } from '@app/util/testing';
import { User } from '@app/entity/domain/user/User.entity';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { CartItemFixtureFactory } from '@app/util/testing/CartItemFixtureFactory';
import { ReviewModule } from '@app/entity/domain/review/ReviewModule';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';
import {
  Payment,
  PaymentDocument,
} from '@app/entity/domain/payment/Payment.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { iamportPaymentMockData } from '../../../../../libs/entity/test/integration/domain/payment/mockData';

describe('OrderApiController', () => {
  let sut: OrderApiController;
  let module: TestingModule;
  let user: User;
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
      controllers: [OrderApiController],
    }).compile();

    sut = module.get(OrderApiController);

    user = await TestUserFactory.create(module);
    paymentRepository = module.get(getModelToken(Payment.name));

    jest
      .spyOn(module.get(PaymentService), 'complete')
      .mockResolvedValue(iamportPaymentMockData);
  });

  afterEach(async () => {
    await paymentRepository.deleteMany({});
    await module.close();
  });

  describe('orderFromCartComplete', () => {
    it('장바구니에 담기지 않은 상품을 주문할 경우 not found error response 반환', async () => {
      const dto = CartOrderRequest.create([1, 2], 'impUid', 'merchantUid');
      const result = await sut.orderFromCartComplete(user, dto);

      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
      expect(result.message).toBe('Cart item not found');
    });

    it('주문내역 반환', async () => {
      await CartItemFixtureFactory.create(module, user);

      const dto = CartOrderRequest.create([1, 2], 'impUid', 'merchantUid');
      const result = await sut.orderFromCartComplete(user, dto);

      const data = result.data as OrderDto;
      expect(data).toEqual({
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
});
