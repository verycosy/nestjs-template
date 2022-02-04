import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './Payment.schema';
import { PaymentService } from './PaymentService';

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
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
