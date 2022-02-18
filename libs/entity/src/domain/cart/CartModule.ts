import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './Cart.entity';
import { CartItem } from './CartItem.entity';
import { CartQueryRepository } from './CartQueryRepository';
import { CartService } from './CartService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, CartQueryRepository]),
    CustomCacheModule,
  ],
  providers: [CartService],
  exports: [TypeOrmModule, CartService],
})
export class CartModule {}
