import { CategoryModule } from '@app/entity/domain/category/CategoryModule';
import { Module } from '@nestjs/common';
import { CategoryApiController } from './controller/CategoryApiController';

@Module({
  imports: [CategoryModule],
  controllers: [CategoryApiController],
})
export class CategoryApiModule {}
