import { CartModule } from '@app/entity/domain/cart/CartModule';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';
import { Module } from '@nestjs/common';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';
import { OrderCancelApiService } from './OrderCancelApiService';

@Module({
  imports: [OrderModule, CartModule, PaymentModule],
  controllers: [OrderApiController],
  providers: [OrderApiService, OrderCancelApiService],
})
export class OrderApiModule {}
