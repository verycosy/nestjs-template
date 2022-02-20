import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { ProductAdminController } from './controller/ProductAdminController';
import { ProductInquiryAdminController } from './controller/ProductInquiryAdminController';
import { ProductAdminService } from './ProductAdminService';
import { ProductInquiryAdminService } from './ProductInquiryAdminService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [ProductAdminService, ProductInquiryAdminService],
  controllers: [ProductAdminController, ProductInquiryAdminController],
})
export class ProductAdminModule {}
