import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import { Module } from '@nestjs/common';
import { CategoryApiController } from './controller/CategoryApiController';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [CategoryApiController],
})
export class CategoryApiModule {}
