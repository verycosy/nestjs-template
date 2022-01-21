import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './Cart.entity';
import { CartItem } from './CartItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  exports: [TypeOrmModule],
})
export class CartModule {}
