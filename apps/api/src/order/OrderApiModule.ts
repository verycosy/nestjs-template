import { PaymentService } from '@app/entity/domain/payment';
import { IamportService } from '@app/entity/domain/pg';
import { Module } from '@nestjs/common';
import { MongooseTestModule } from '@app/entity/mongoose.test.module';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { OrderApiController } from './controller/OrderApiController';
import { OrderApiService } from './OrderApiService';
import { OrderCancelApiService } from './OrderCancelApiService';
import { CartModule } from '@app/entity/domain/cart/CartModule';

@Module({
  imports: [MongooseTestModule, TypeOrmTestModule, CartModule],
  controllers: [OrderApiController],
  providers: [
    OrderApiService,
    OrderCancelApiService,
    PaymentService,
    IamportService,
  ],
})
export class OrderApiModule {}
