import { getConfigModule } from '@app/config';
import {
  Payment,
  PaymentDocument,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { IamportService } from '@app/entity/domain/pg';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseTestModule } from '@app/entity/mongoose.test.module';
import { Model } from 'mongoose';
import { iamportPaymentMockData } from './mockData';

describe('PaymentService', () => {
  let sut: PaymentService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), MongooseTestModule],
      providers: [PaymentService, IamportService],
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
