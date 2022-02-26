import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerApiController } from './BannerApiController';
import { BannerApiQueryRepository } from './BannerApiQueryRepository';
import { BannerApiService } from './BannerApiService';

@Module({
  imports: [TypeOrmModule.forFeature([BannerApiQueryRepository])],
  providers: [BannerApiService],
  controllers: [BannerApiController],
})
export class BannerApiModule {}
