import { BannerModule } from '@app/entity/domain/banner/BannerModule';
import { UploadModule } from '@app/util/UploadModule';
import { Module } from '@nestjs/common';
import { BannerAdminController } from './BannerAdminController';

@Module({
  imports: [BannerModule, UploadModule],
  controllers: [BannerAdminController],
})
export class BannerAdminModule {}
