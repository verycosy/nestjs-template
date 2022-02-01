import { Module } from '@nestjs/common';
import { getLoggerOptions, getConfigModule } from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { getTypeOrmTestModule } from '../../../libs/entity/test/typeorm.test.module';
import { getApiModuleProvider } from './getApiModuleProvider';
import { UserApiModule } from './user/UserApiModule';
import { ProductApiModule } from './product/ProductApiModule';
import { OrderApiModule } from './order/OrderApiModule';
import { CartApiModule } from './cart/CartApiModule';
import { CategoryApiModule } from './category/CategoryApiModule';
import { ReviewApiModule } from './review/ReviewApiModule';

@Module({
  imports: [
    getConfigModule(),
    WinstonModule.forRoot(getLoggerOptions()),
    getTypeOrmTestModule(),
    ProductApiModule,
    UserApiModule,
    OrderApiModule,
    CartApiModule,
    CategoryApiModule,
    ReviewApiModule,
  ],
  controllers: [],
  providers: [...getApiModuleProvider()],
})
export class ApiModule {}
