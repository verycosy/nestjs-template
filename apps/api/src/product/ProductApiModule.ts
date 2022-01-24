import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { ProductApiController, ProductApiService } from '.';
import { ProductInquiryApiController } from './controller/ProductInquiryApiController';
import { ProductInquiryApiService } from './ProductInquiryApiService';

@Module({
  imports: [ProductModule],
  controllers: [ProductApiController, ProductInquiryApiController],
  providers: [ProductApiService, ProductInquiryApiService],
})
export class ProductApiModule {}
