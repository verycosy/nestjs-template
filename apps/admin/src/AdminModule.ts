import { AuthModule } from '@app/auth';
import { getConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { CategoryAdminModule } from './category/CategoryAdminModule';
import { NoticeAdminModule } from './notice/NoticeAdminModule';
import { ProductAdminModule } from './product/ProductAdminModule';
import { UserAdminModule } from './user/UserAdminModule';

@Module({
  imports: [
    getConfigModule(),
    TypeOrmTestModule,
    AuthModule,
    CategoryAdminModule,
    ProductAdminModule,
    UserAdminModule,
    NoticeAdminModule,
  ],
})
export class AdminModule {}
