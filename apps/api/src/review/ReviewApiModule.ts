import { OrderModule } from '@app/entity/domain/order/OrderModule';
import { ReviewModule } from '@app/entity/domain/review/ReviewModule';
import { Module } from '@nestjs/common';
import { ReviewApiController } from './controller/ReviewApiController';
import { ReviewApiService } from './ReviewApiService';

@Module({
  imports: [ReviewModule, OrderModule],
  controllers: [ReviewApiController],
  providers: [ReviewApiService],
})
export class ReviewApiModule {}
