import { CategoryModule } from '@app/entity/domain/category';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { ProductAdminController } from './controller/ProductAdminController';
import { ProductInquiryAdminController } from './controller/ProductInquiryAdminController';
import { ProductAdminService } from './ProductAdminService';
import { ProductInquiryAdminService } from './ProductInquiryAdminService';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [ProductAdminService, ProductInquiryAdminService],
  controllers: [ProductAdminController, ProductInquiryAdminController],
})
export class ProductAdminModule {}
