import { ProductInquiryModule } from '@app/entity/domain/product-inquiry/ProductInquiryModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApiController, ProductApiService } from '.';
import { ProductInquiryApiController } from './controller/ProductInquiryApiController';
import { ProductApiQueryRepository } from './ProductApiQueryRepository';

@Module({
  imports: [
    ProductModule,
    ProductInquiryModule,
    TypeOrmModule.forFeature([ProductApiQueryRepository]),
  ],
  controllers: [ProductApiController, ProductInquiryApiController],
  providers: [ProductApiService],
})
export class ProductApiModule {}
