import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IamportService } from '../pg';
import { Payment, PaymentSchema } from './Payment.schema';
import { PaymentRepository } from './PaymentRepository';
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
  providers: [PaymentService, IamportService, PaymentRepository],
  exports: [PaymentService, MongooseModule],
})
export class PaymentModule {}
