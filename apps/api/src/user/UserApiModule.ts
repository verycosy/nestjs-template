import { UserModule } from '@app/entity/domain/user/UserModule';
import { AuthCodeModule } from '@app/util/auth-code';
import { Module } from '@nestjs/common';
import { SignUpService } from './SignUpService';
import { UserApiController } from './UserApiController';
import { UserApiService } from './UserApiService';

@Module({
  imports: [UserModule, AuthCodeModule],
  controllers: [UserApiController],
  providers: [UserApiService, SignUpService],
})
export class UserApiModule {}
