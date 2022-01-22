import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/CartModule';
import { User } from './User.entity';
import { UserQueryRepository } from './UserQueryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserQueryRepository]), CartModule],
  exports: [TypeOrmModule],
})
export class UserModule {}
