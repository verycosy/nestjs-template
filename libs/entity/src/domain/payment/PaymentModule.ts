import { Module } from '@nestjs/common';
import { MongooseTestModule } from '../../../../../libs/entity/test/mongoose.test.module';
import { IamportService } from '../pg';
import { PaymentService } from './PaymentService';

@Module({
  imports: [MongooseTestModule],
  providers: [PaymentService, IamportService],
  exports: [PaymentService],
})
export class PaymentModule {}
