import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { CartService } from './CartService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
