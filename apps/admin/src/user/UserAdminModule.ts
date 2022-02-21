import { Module } from '@nestjs/common';
import { UserAdminController } from './controller/UserAdminController';
import { UserAdminService } from './UserAdminService';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAdminQueryRepository } from './UserAdminQueryRepository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserAdminQueryRepository])],
  controllers: [UserAdminController],
  providers: [UserAdminService],
})
export class UserAdminModule {}
