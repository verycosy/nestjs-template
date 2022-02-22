import { Module } from '@nestjs/common';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';

@Module({
  imports: [OrderModule, PaymentModule],
  controllers: [OrderApiController],
  providers: [OrderApiService],
})
export class OrderApiModule {}
