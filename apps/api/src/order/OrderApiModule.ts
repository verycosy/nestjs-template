import { CartModule } from '@app/entity/domain/cart/CartModule';
import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { Module } from '@nestjs/common';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';

@Module({
  imports: [OrderModule, CartModule],
  controllers: [OrderApiController],
  providers: [OrderApiService],
})
export class OrderApiModule {}
