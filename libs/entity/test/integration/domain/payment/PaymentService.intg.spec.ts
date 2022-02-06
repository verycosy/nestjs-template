import { getConfigModule } from '@app/config';
import {
  Payment,
  PaymentDocument,
  PaymentSchema,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentService } from '@app/entity/domain/payment/PaymentService';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
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
      providers: [PaymentService],
    }).compile();

    sut = module.get(PaymentService);
    jest.spyOn(sut, 'complete').mockResolvedValue(iamportPaymentMockData);
  });

  afterEach(async () => {
    const paymentRepository = module.get<Model<PaymentDocument>>(
      getModelToken(Payment.name),
    );
    await paymentRepository.deleteMany({});

    await module.close();
  });

  it('저장된 아임포트 결제 데이터를 반환', async () => {
    const result = await sut.save(iamportPaymentMockData);

    expect(result._id).toBeInstanceOf(Types.ObjectId);
    expect(result).toMatchObject(iamportPaymentMockData);
  });
});
