import { CartModule } from '@app/entity/domain/cart/CartModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Module } from '@nestjs/common';
import { CartApiController, CartApiService } from '.';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [CartApiController],
  providers: [CartApiService],
})
export class CartApiModule {}
