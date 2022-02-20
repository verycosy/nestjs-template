import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ReviewApiController } from './controller/ReviewApiController';
import { ReviewApiService } from './ReviewApiService';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [ReviewApiController],
  providers: [ReviewApiService],
})
export class ReviewApiModule {}
