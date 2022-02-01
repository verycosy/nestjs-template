import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './Review.entity';
import { ReviewQueryRepository } from './ReviewQueryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewQueryRepository])],
  exports: [TypeOrmModule],
})
export class ReviewModule {}
