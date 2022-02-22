import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { CustomCacheModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { CartOrderService } from './CartOrderService';

@Module({
  imports: [TypeOrmTestModule, CustomCacheModule],
  providers: [CartOrderService],
  exports: [CartOrderService],
})
export class OrderModule {}
