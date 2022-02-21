import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ProductService } from './ProductService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
