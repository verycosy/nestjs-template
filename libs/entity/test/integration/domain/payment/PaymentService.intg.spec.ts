import { getConfigModule } from '@app/config';
import {
  Payment,
  PaymentDocument,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { iamportPaymentMockData } from './mockData';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';

describe('PaymentService', () => {
  let sut: PaymentService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), PaymentModule],
    }).compile();

    sut = module.get(PaymentService);
    jest
      .spyOn(sut, 'complete')
      .mockResolvedValue(iamportPaymentMockData as any);
  });

  afterEach(async () => {
    const paymentRepository = module.get<Model<PaymentDocument>>(
      getModelToken(Payment.name),
    );
    await paymentRepository.deleteMany({});

    await module.close();
  });

  it('', async () => {});
});
