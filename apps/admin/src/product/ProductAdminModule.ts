import { Module } from '@nestjs/common';
import { ProductAdminController } from './controller/ProductAdminController';
import { ProductInquiryAdminController } from './controller/ProductInquiryAdminController';
import { ProductModule } from '@app/entity/domain/product/ProductModule';

@Module({
  imports: [ProductModule],
  controllers: [ProductAdminController, ProductInquiryAdminController],
})
export class ProductAdminModule {}
