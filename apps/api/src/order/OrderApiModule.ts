import { CartModule } from '@app/entity/domain/cart/CartModule';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { PaymentModule } from '@app/entity/domain/payment/PaymentModule';
import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';

@Module({
  imports: [OrderModule, CartModule, PaymentModule, CustomCacheModule],
  controllers: [OrderApiController],
  providers: [OrderApiService],
})
export class OrderApiModule {}
