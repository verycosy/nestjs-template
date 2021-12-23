import { AuthModule } from '@app/auth';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { AuthCodeModule } from '@app/util/auth-code';
import { Module } from '@nestjs/common';
import { UserAuthApiController, UserApiController } from './controller';
import { UserApiService } from './UserApiService';

@Module({
  imports: [UserModule, AuthCodeModule, AuthModule],
  controllers: [UserAuthApiController, UserApiController],
  providers: [UserApiService],
})
export class UserApiModule {}
