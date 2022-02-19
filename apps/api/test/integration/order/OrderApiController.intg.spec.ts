import { getConfigModule } from '@app/config';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Test, TestingModule } from '@nestjs/testing';
import {
  OrderApiController,
  OrderApiService,
  OrderCancelApiService,
} from '../../../../../apps/api/src/order';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import {
  OrderCompleteRequest,
  CartOrderReadyRequest,
  OrderDto,
} from '../../../../../apps/api/src/order/dto';
import { TestOrderFactory, TestUserFactory } from '@app/util/testing';
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
import { EntityNotFoundError } from 'typeorm';

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
      providers: [OrderApiService, OrderCancelApiService],
      controllers: [OrderApiController],
    }).compile();

    sut = module.get(OrderApiController);

    user = await TestUserFactory.create(module);
    paymentRepository = module.get(getModelToken(Payment.name));

    jest
      .spyOn(module.get(PaymentService), 'complete')
      .mockResolvedValue(iamportPaymentMockData as any);
    jest
      .spyOn(module.get(PaymentService), 'cancel')
      .mockResolvedValue(iamportPaymentMockData as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await paymentRepository.deleteMany({});
    await module.close();
  });

  describe('orderFromCartReady', () => {
    it('장바구니에 담기지 않은 상품을 주문할 경우 EntityNotFoundError를 던진다', async () => {
      const dto = new CartOrderReadyRequest([1, 2]);

      try {
        await sut.orderFromCartReady(user, dto);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    });

    it('결제준비된 주문번호 반환', async () => {
      await CartItemFixtureFactory.create(module, user);
      const dto = new CartOrderReadyRequest([1, 2]);

      const result = await sut.orderFromCartReady(user, dto);

      expect(result.data.length).toBe(36);
    });
  });

  describe('orderFromCartComplete', () => {
    it('결제준비된 주문이 없으면 EntityNotFoundError를 던진다', async () => {
      const dto = new OrderCompleteRequest('impUid', 'merchantUid');

      const actual = () => sut.orderFromCartComplete(dto);

      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('위조된 결제일 경우 ', async () => {
      const cartItems = await CartItemFixtureFactory.create(module, user);
      const order = await TestOrderFactory.createFromCartItems(module, user, [
        cartItems[0],
      ]);

      const dto = new OrderCompleteRequest('impUid', order.merchantUid);

      const result = await sut.orderFromCartComplete(dto);
      expect(result.message).toBe(
        `Accept order failed. order amount:3000, paid amount:4000`,
      );
      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);
    });

    it('결제 완료된 주문 반환', async () => {
      const cartItems = await CartItemFixtureFactory.create(module, user);
      const order = await TestOrderFactory.createFromCartItems(
        module,
        user,
        cartItems,
      );

      const dto = new OrderCompleteRequest('impUid', order.merchantUid);

      const result = await sut.orderFromCartComplete(dto);

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
