import { Module } from '@nestjs/common';
import { ProductAdminController } from './controller/ProductAdminController';
import { ProductInquiryAdminController } from './controller/ProductInquiryAdminController';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { ProductInquiryModule } from '@app/entity/domain/product-inquiry/ProductInquiryModule';

@Module({
  imports: [ProductModule, ProductInquiryModule],
  controllers: [ProductAdminController, ProductInquiryAdminController],
})
export class ProductAdminModule {}
