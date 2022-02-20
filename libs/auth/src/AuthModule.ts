import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './AuthService';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), TypeOrmTestModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
