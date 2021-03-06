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
      .spyOn(module.get(PaymentService), 'save')
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
    describe('?????? ??????', () => {
      it('????????? ?????? ??? ????????? EntityNotFoundError??? ?????????', async () => {
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

      it('??????????????? ?????? ??? ????????? EntityNotFoundError??? ?????????', async () => {
        // given
        await CartItemFixtureFactory.create(module, user);
        const dto = new SingleOrderDto(1, 4, 3);

        // when
        const actual = () => sut.ready(user, dto);

        // then
        await expect(actual()).rejects.toThrowError(EntityNotFoundError);
      });

      it('??????????????? ?????? ?????? ??????', async () => {
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

    describe('???????????? ??????', () => {
      it('????????? ???????????? ????????? ????????? EntityNotFoundError??? ?????????', async () => {
        try {
          await sut.ready(user, [1, 2]);
        } catch (err) {
          expect(err).toBeInstanceOf(EntityNotFoundError);
        }
      });

      it('??????????????? ?????? ?????? ??????', async () => {
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
    it('??????????????? ????????? ????????? EntityNotFoundError ??????', async () => {
      try {
        await sut.complete('impUid', 'merchantUid');
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    });

    it('????????? ????????? ?????? ?????? ?????? ??? ?????? ?????? ??? ForgeryOrderError??? ?????????', async () => {
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

    it('?????? ????????? ?????? ?????? ??????', async () => {
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
    it('???????????? ?????? ??????????????? ??????', async () => {});

    it('????????? ??????????????? ?????? ??????', async () => {});

    it('?????? ??????(????????????)??? ??????????????? ??????', async () => {});

    describe('iamport ?????? ?????? ??????', () => {
      it('????????????(checksum)', async () => {});

      it('?????? ??????', async () => {});
    });

    it('????????? ???????????? ??????', async () => {});
  });
});
