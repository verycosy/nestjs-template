import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ProductInquiryService } from './ProductInquiryService';
import { ProductService } from './ProductService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [ProductService, ProductInquiryService],
  exports: [ProductService, ProductInquiryService],
})
export class ProductModule {}
