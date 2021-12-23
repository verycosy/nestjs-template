import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './AuthService';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
