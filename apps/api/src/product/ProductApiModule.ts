import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Module } from '@nestjs/common';
import { ProductApiController, ProductApiService } from '.';
import { ProductInquiryApiController } from './controller/ProductInquiryApiController';
import { ProductInquiryApiService } from './ProductInquiryApiService';

@Module({
  imports: [ProductModule, UserModule],
  controllers: [ProductApiController, ProductInquiryApiController],
  providers: [ProductApiService, ProductInquiryApiService],
})
export class ProductApiModule {}
