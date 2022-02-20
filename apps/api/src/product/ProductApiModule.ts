import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { ProductApiController, ProductApiService } from '.';
import { ProductInquiryApiController } from './controller/ProductInquiryApiController';
import { ProductInquiryApiService } from './ProductInquiryApiService';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [ProductApiController, ProductInquiryApiController],
  providers: [ProductApiService, ProductInquiryApiService],
})
export class ProductApiModule {}
