import { UserModule } from '@app/entity/domain/user/UserModule';
import { Module } from '@nestjs/common';
import { SignUpService } from './SignUpService';
import { UserApiController } from './UserApiController';
import { UserApiService } from './UserApiService';

@Module({
  imports: [UserModule],
  controllers: [UserApiController],
  providers: [UserApiService, SignUpService],
})
export class UserApiModule {}
