import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { CartApiController, CartApiService } from '.';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [CartApiController],
  providers: [CartApiService],
})
export class CartApiModule {}
