import {
  Payment,
  PaymentDocument,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentRepository } from '@app/entity/domain/payment/PaymentRepository';
import { IamportPayment } from '@app/entity/domain/pg';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { iamportPaymentMockData } from '../../../../../../libs/entity/test/integration/domain/payment/mockData';
import { EntityNotFoundError } from 'typeorm';
import { MongooseTestModule } from '@app/entity/mongoose.test.module';

describe('PaymentRepository', () => {
  let sut: PaymentRepository;
  let module: TestingModule;
  let paymentModel: Model<PaymentDocument>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MongooseTestModule],
    }).compile();

    sut = module.get(PaymentRepository);
    paymentModel = module.get(getModelToken(Payment.name));
  });

  afterEach(async () => {
    await paymentModel.deleteMany({});
  });

  describe('findOneOrFail', () => {
    it('결제 내역을 찾지 못하면 EntityNotFoundError를 던진다', async () => {
      // given

      // when
      const actual = () => sut.findOneOrFail('merchantUid');

      // then
      expect(actual()).rejects.toThrowError(EntityNotFoundError);
    });

    it('찾은 결제 내역 반환', async () => {
      // given
      const payment = await paymentModel.create(
        plainToClass(IamportPayment, iamportPaymentMockData),
      );

      // when
      const result = await sut.findOneOrFail(payment.merchantUid);

      // then
      expect(result).toMatchObject(payment.toJSON());
    });
  });

  describe('save', () => {
    it('insert', async () => {
      // given
      const payment = new Payment(
        plainToClass(IamportPayment, iamportPaymentMockData),
      );

      // when
      const result = await sut.save(payment);

      // then
      expect(result._id).toBeInstanceOf(Types.ObjectId);
      expect(result.amount).toBe(payment.amount);
    });

    it('update', async () => {
      // given
      const payment = new Payment(
        plainToClass(IamportPayment, iamportPaymentMockData),
      );
      await paymentModel.create(payment);

      // when
      payment.amount = 9000;
      const result = await sut.save(payment);

      // then
      expect(result.amount).toBe(9000);
    });
  });
});
