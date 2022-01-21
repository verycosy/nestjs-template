import { CartModule } from '@app/entity/domain/cart/CartModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Module } from '@nestjs/common';
import { UserAdminController } from './controller/UserAdminController';
import { UserAdminService } from './UserAdminService';

@Module({
  imports: [UserModule, CartModule],
  controllers: [UserAdminController],
  providers: [UserAdminService],
})
export class UserAdminModule {}
