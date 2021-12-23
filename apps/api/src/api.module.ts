import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  getLoggerOptions,
  configValidationSchema,
} from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { getTypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { getApiModuleProvider } from './getApiModuleProvider';
import { UserApiModule } from './user/UserApiModule';
import { AuthModule } from '../../../libs/auth/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    WinstonModule.forRoot(getLoggerOptions()),
    getTypeOrmTestModule(),
    UserApiModule,
    AuthModule,
  ],
  controllers: [],
  providers: [...getApiModuleProvider()],
})
export class ApiModule {}
