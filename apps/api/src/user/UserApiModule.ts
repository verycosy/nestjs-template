import { AuthModule } from '@app/auth';
import { AuthCodeModule } from '@app/util/auth-code';
import { Module } from '@nestjs/common';
import { UserAuthApiController, UserApiController } from './controller';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { UploadModule } from '@app/util/UploadModule';

@Module({
  imports: [UserModule, AuthCodeModule, AuthModule, UploadModule],
  controllers: [UserAuthApiController, UserApiController],
})
export class UserApiModule {}
