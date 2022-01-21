import { Module } from '@nestjs/common';
import { getLoggerOptions, getConfigModule } from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { getTypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { getApiModuleProvider } from './getApiModuleProvider';
import { UserApiModule } from './user/UserApiModule';
import { ProductApiModule } from './product/ProductApiModule';

@Module({
  imports: [
    getConfigModule(),
    WinstonModule.forRoot(getLoggerOptions()),
    getTypeOrmTestModule(),
    ProductApiModule,
    UserApiModule,
  ],
  controllers: [],
  providers: [...getApiModuleProvider()],
})
export class ApiModule {}
