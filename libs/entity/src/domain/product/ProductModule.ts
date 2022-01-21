import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './Product.entity';
import { ProductOption } from './ProductOption.entity';
import { ProductQueryRepository } from './ProductQueryRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductQueryRepository, ProductOption]),
  ],
  exports: [TypeOrmModule],
})
export class ProductModule {}
