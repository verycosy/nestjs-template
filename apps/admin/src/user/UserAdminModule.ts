import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import { UserAdminController } from './controller/UserAdminController';
import { UserAdminService } from './UserAdminService';

@Module({
  imports: [TypeOrmTestModule],
  controllers: [UserAdminController],
  providers: [UserAdminService],
})
export class UserAdminModule {}
