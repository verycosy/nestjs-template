import { MongooseTestModule } from '@app/entity/mongoose.test.module';
import { Module } from '@nestjs/common';
import { PaymentService } from '.';
import { IamportService } from '../pg';
import { PaymentRepository } from './PaymentRepository';

@Module({
  imports: [MongooseTestModule],
  providers: [PaymentRepository, PaymentService, IamportService],
  exports: [PaymentService],
})
export class PaymentModule {}
