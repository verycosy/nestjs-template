import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';
import { OrderCancelApiService } from './OrderCancelApiService';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';

@Module({
  imports: [TypeOrmTestModule, OrderModule, PaymentModule],
  controllers: [OrderApiController],
  providers: [OrderApiService, OrderCancelApiService],
})
export class OrderApiModule {}
