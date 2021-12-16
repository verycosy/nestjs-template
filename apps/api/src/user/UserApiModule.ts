import { UserModule } from '@app/entity/domain/user/UserModule';
import { RedisModule } from '@app/util/cache';
import { Module } from '@nestjs/common';
import { SignUpService } from './SignUpService';
import { UserApiController } from './UserApiController';
import { UserApiService } from './UserApiService';

@Module({
  imports: [UserModule, RedisModule],
  controllers: [UserApiController],
  providers: [UserApiService, SignUpService],
})
export class UserApiModule {}
