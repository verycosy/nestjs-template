import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ReviewService } from './ReviewService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
