import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartApiController, CartApiService } from '.';
import { CartApiQueryRepository } from './CartApiQueryRepository';

@Module({
  imports: [
    TypeOrmTestModule,
    TypeOrmModule.forFeature([CartApiQueryRepository]),
  ],
  controllers: [CartApiController],
  providers: [CartApiService],
})
export class CartApiModule {}
