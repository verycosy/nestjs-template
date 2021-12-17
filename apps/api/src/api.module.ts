import { Module } from '@nestjs/common';
import { TypeOrmTestModule } from 'libs/entity/test/typeorm.test.module';
import { UserApiModule } from './user/UserApiModule';

@Module({
  imports: [TypeOrmTestModule, UserApiModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
