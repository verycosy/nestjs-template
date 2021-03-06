import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { CartOrderService } from './CartOrderService';
import { OrderCancelService } from './OrderCancelService';
import { OrderCompleteService } from './OrderCompleteService';
import { SingleOrderService } from './SingleOrderService';

const USE_CASE = [
  CartOrderService,
  SingleOrderService,
  OrderCompleteService,
  OrderCancelService,
];

@Module({
  imports: [TypeOrmTestModule, CustomCacheModule],
  providers: [...USE_CASE],
  exports: [...USE_CASE],
})
export class OrderModule {}
