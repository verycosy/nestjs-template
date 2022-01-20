import { CategoryModule } from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { ProductAdminController } from './controller/ProductAdminController';
import { ProductAdminService } from './ProductAdminService';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [ProductAdminService],
  controllers: [ProductAdminController],
})
export class ProductAdminModule {}
