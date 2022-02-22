import { CartModule } from '@app/entity/domain/cart/CartModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartApiController, CartApiService } from '.';
import { CartApiQueryRepository } from './CartApiQueryRepository';

@Module({
  imports: [CartModule, TypeOrmModule.forFeature([CartApiQueryRepository])],
  controllers: [CartApiController],
  providers: [CartApiService],
})
export class CartApiModule {}
