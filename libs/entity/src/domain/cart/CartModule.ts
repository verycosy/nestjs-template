import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { CartService } from './CartService';

@Module({
  imports: [TypeOrmTestModule, CustomCacheModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
