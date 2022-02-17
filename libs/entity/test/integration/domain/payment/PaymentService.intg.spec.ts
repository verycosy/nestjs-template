import { getConfigModule } from '@app/config';
import {
  Payment,
  PaymentDocument,
  PaymentSchema,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentRepository } from '@app/entity/domain/payment/PaymentRepository';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { IamportService } from '@app/entity/domain/pg';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { iamportPaymentMockData } from './mockData';

describe('PaymentService', () => {
  let sut: PaymentService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        MongooseModule.forRoot('mongodb://localhost:47017', {
          dbName: 'test',
          user: 'root',
          pass: 'password',
        }),
        MongooseModule.forFeature([
          {
            name: Payment.name,
            schema: PaymentSchema,
          },
        ]),
      ],
      providers: [PaymentService, IamportService, PaymentRepository],
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
