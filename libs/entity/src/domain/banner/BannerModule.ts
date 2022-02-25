import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { Module } from '@nestjs/common';
import { BannerService } from './BannerService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
