import { AuthModule } from '@app/auth';
import { getConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import { getTypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { CategoryAdminModule } from './category/CategoryAdminModule';
import { ProductAdminModule } from './product/ProductAdminModule';
import { UserAdminModule } from './user/UserAdminModule';

@Module({
  imports: [
    getConfigModule(),
    getTypeOrmTestModule(),
    AuthModule,
    CategoryAdminModule,
    ProductAdminModule,
    UserAdminModule,
  ],
})
export class AdminModule {}
