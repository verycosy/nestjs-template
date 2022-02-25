import { Module } from '@nestjs/common';
import { getLoggerOptions, getConfigModule } from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { UserApiModule } from './user/UserApiModule';
import { ProductApiModule } from './product/ProductApiModule';
import { OrderApiModule } from './order/OrderApiModule';
import { CartApiModule } from './cart/CartApiModule';
import { CategoryApiModule } from './category/CategoryApiModule';
import { ReviewApiModule } from './review/ReviewApiModule';
import { NoticeApiModule } from './notice';

@Module({
  imports: [
    getConfigModule(),
    WinstonModule.forRoot(getLoggerOptions()),
    TypeOrmTestModule,
    ProductApiModule,
    UserApiModule,
    OrderApiModule,
    CartApiModule,
    CategoryApiModule,
    ReviewApiModule,
    NoticeApiModule,
  ],
})
export class ApiModule {}
