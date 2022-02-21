import { CartService } from '@app/entity/domain/cart/CartService';
import { OrderService } from '@app/entity/domain/order/OrderService';
import { PaymentService } from '@app/entity/domain/payment';
import { IamportService } from '@app/entity/domain/pg';
import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { MongooseTestModule } from '@app/entity/mongoose.test.module';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';
import { OrderCancelApiService } from './OrderCancelApiService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApiQueryRepository } from '../product/ProductApiQueryRepository';

@Module({
  imports: [
    MongooseTestModule,
    TypeOrmTestModule,
    CustomCacheModule,
    TypeOrmModule.forFeature([ProductApiQueryRepository]),
  ],
  controllers: [OrderApiController],
  providers: [
    OrderApiService,
    OrderCancelApiService,
    OrderService,
    CartService,
    PaymentService,
    IamportService,
  ],
})
export class OrderApiModule {}
