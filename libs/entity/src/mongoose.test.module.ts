import {
  Payment,
  PaymentSchema,
} from '@app/entity/domain/payment/Payment.schema';
import { PaymentRepository } from '@app/entity/domain/payment/PaymentRepository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
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
  providers: [PaymentRepository],
  exports: [MongooseModule, PaymentRepository],
})
export class MongooseTestModule {}
