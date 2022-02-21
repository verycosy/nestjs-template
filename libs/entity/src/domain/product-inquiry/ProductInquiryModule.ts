import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ProductInquiryService } from './ProductInquiryService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [ProductInquiryService],
  exports: [ProductInquiryService],
})
export class ProductInquiryModule {}
