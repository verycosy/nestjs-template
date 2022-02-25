import { AuthModule } from '@app/auth';
import { getConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import { BannerAdminModule } from './banner/BannerAdminModule';
import { CategoryAdminModule } from './category/CategoryAdminModule';
import { NoticeAdminModule } from './notice/NoticeAdminModule';
import { ProductAdminModule } from './product/ProductAdminModule';
import { UserAdminModule } from './user/UserAdminModule';

@Module({
  imports: [
    getConfigModule(),
    AuthModule,
    CategoryAdminModule,
    ProductAdminModule,
    UserAdminModule,
    NoticeAdminModule,
    BannerAdminModule,
  ],
})
export class AdminModule {}
