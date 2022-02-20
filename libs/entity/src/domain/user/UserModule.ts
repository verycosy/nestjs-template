import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { UserService } from './UserService';

@Module({
  imports: [TypeOrmTestModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
