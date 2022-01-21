import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { ProductApiController, ProductApiService } from '.';

@Module({
  imports: [ProductModule],
  controllers: [ProductApiController],
  providers: [ProductApiService],
})
export class ProductApiModule {}
