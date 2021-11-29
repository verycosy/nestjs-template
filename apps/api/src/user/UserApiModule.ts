import { UserModule } from '@app/entity/domain/user/UserModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
})
export class UserApiModule {}
