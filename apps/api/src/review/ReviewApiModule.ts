import { ReviewModule } from '@app/entity/domain/review/ReviewModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewApiController } from './controller/ReviewApiController';
import { ReviewApiQueryRepository } from './ReviewApiQueryRepository';
import { ReviewApiService } from './ReviewApiService';

@Module({
  imports: [ReviewModule, TypeOrmModule.forFeature([ReviewApiQueryRepository])],
  controllers: [ReviewApiController],
  providers: [ReviewApiService],
})
export class ReviewApiModule {}
