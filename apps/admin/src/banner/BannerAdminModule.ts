import { BannerModule } from '@app/entity/domain/banner/BannerModule';
import { UploadModule } from '@app/util/UploadModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerAdminController } from './BannerAdminController';
import { BannerAdminQueryRepository } from './BannerAdminQueryRepository';
import { BannerAdminService } from './BannerAdminService';

@Module({
  imports: [
    BannerModule,
    UploadModule,
    TypeOrmModule.forFeature([BannerAdminQueryRepository]),
  ],
  providers: [BannerAdminService],
  controllers: [BannerAdminController],
})
export class BannerAdminModule {}
