import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './Order.entity';
import { OrderItem } from './OrderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
})
export class OrderModule {}
