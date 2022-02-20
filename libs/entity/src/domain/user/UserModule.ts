import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { UserService } from './UserService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
