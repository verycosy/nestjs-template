import {
  Payment,
  PaymentSchema,
} from '@app/entity/domain/payment/Payment.schema';
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
  exports: [MongooseModule],
})
export class MongooseTestModule {}
