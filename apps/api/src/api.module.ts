import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getLoggerOptions } from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { getTypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { getApiModuleProvider } from './getApiModuleProvider';
import { UserApiModule } from './user/UserApiModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(getLoggerOptions()),
    getTypeOrmTestModule(),
    UserApiModule,
  ],
  controllers: [],
  providers: [...getApiModuleProvider()],
})
export class ApiModule {}
