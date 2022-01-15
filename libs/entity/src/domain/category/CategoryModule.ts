import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './Category.entity';
import { SubCategory } from './SubCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory])],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
