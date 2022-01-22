import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './Cart.entity';
import { CartItem } from './CartItem.entity';
import { CartQueryRepository } from './CartQueryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, CartQueryRepository])],
  exports: [TypeOrmModule],
})
export class CartModule {}
