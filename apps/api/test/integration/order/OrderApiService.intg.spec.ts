import { getConfigModule } from '@app/config';
import { TestOrderFactory, TestUserFactory } from '@app/util/testing';
import { CartItemFixtureFactory } from '@app/util/testing/CartItemFixtureFactory';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { iamportPaymentMockData } from '../../../../../libs/entity/test/integration/domain/payment/mockData';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import {
  PaymentDocument,
  Payment,
} from '@app/entity/domain/payment/Payment.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService, CACHE_SERVICE } from '@app/util/cache';
import { User } from '@app/entity/domain/user/User.entity';
import { OrderApiService } from '../../../../../apps/api/src/order';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { OrderApiModule } from '../../../../../apps/api/src/order/OrderApiModule';
import { SingleOrderDto } from '@app/entity/domain/order/type/SingleOrderDto';
import { ForgeryOrderError } from '@app/entity/domain/order/error/ForgeryOrderError';

describe('OrderApiService', () => {
  let sut: OrderApiService;
  let module: TestingModule;
  let cartRepository: Repository<Cart>;
  let paymentRepository: Model<PaymentDocument>;
  let user: User;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), OrderApiModule],
    }).compile();

    sut = module.get(OrderApiService);
    cartRepository = module.get('CartRepository');
    paymentRepository = module.get(getModelToken(Payment.name));

    user = await TestUserFactory.create(module);

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

  describe('ready', () => {
    describe('단건 주문', () => {
      it('상품을 찾을 수 없으면 EntityNotFoundError를 던진다', async () => {
        // given
        const dto = new SingleOrderDto(1, 2, 3);

        try {
          // when
          await sut.ready(user, dto);
        } catch (err) {
          // then
          expect(err).toBeInstanceOf(EntityNotFoundError);
        }
      });

      it('상품옵션을 찾을 수 없으면 EntityNotFoundError를 던진다', async () => {
        // given
        await CartItemFixtureFactory.create(module, user);
        const dto = new SingleOrderDto(1, 4, 3);

        // when
        const actual = () => sut.ready(user, dto);

        // then
        expect(actual()).rejects.toThrowError(EntityNotFoundError);
      });

      it('결제준비된 주문 객체 반환', async () => {
        // given
        await CartItemFixtureFactory.create(module, user);
        const dto = new SingleOrderDto(1, 2, 3);

        // when
        const result = await sut.ready(user, dto);

        // then
        expect(result).toMatchObject({
          id: 1,
          status: OrderStatus.Ready,
          items: [
            {
              id: 1,
              quantity: 3,
              optionPrice: 2000,
              optionDetail: 'product option 2',
              optionDiscount: 0,
              productName: 'banana',
              status: 'accept',
            },
          ],
        });
      });
    });

    describe('장바구니 주문', () => {
      it('주문할 장바구니 상품이 없으면 EntityNotFoundError를 던진다', async () => {
        try {
          await sut.ready(user, [1, 2]);
        } catch (err) {
          expect(err).toBeInstanceOf(EntityNotFoundError);
        }
      });

      it('결제준비된 주문 객체 반환', async () => {
        await CartItemFixtureFactory.create(module, user);

        const result = await sut.ready(user, [1, 2]);

        expect(result).toMatchObject({
          id: 1,
          status: OrderStatus.Ready,
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

  describe('complete', () => {
    it('결제완료할 주문이 없으면 EntityNotFoundError 반환', async () => {
      try {
        await sut.complete('impUid', 'merchantUid');
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    });

    it('위조된 결제일 경우 주문 삭제 및 결제 취소 후 ForgeryOrderError를 던진다', async () => {
      const cartItems = await CartItemFixtureFactory.create(module, user);
      const order = await TestOrderFactory.createFromCartItems(module, user, [
        cartItems[0],
      ]);
      const cancelSpy = jest.spyOn(module.get(PaymentService), 'cancel');

      try {
        await sut.complete('impUid', order.merchantUid);
      } catch (err) {
        expect(err).toBeInstanceOf(ForgeryOrderError);
        expect(cancelSpy).toBeCalledWith(
          'impUid',
          `Accept order failed. order amount:3000, paid amount:4000`,
        );
        expect(err.message).toBe(
          `Accept order failed. order amount:3000, paid amount:4000`,
        );
      }
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
      expect(result.status).toBe(OrderStatus.Complete);
      const cart = await cartRepository.findOne({
        where: { user },
        relations: ['items'],
      });
      expect(cart.items.length).toBe(0);
    });
  });

  describe('cancel', () => {
    it('존재하지 않는 주문항목인 경우', async () => {});

    it('저장된 결제내역이 없는 경우', async () => {});

    it('이미 취소(전액환불)된 주문항목인 경우', async () => {});

    describe('iamport 결제 취소 에러', () => {
      it('취소불가(checksum)', async () => {});

      it('통신 오류', async () => {});
    });

    it('취소된 주문항목 반환', async () => {});
  });
});
