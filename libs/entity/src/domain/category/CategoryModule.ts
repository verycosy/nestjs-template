import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { CategoryService } from './CategoryService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
