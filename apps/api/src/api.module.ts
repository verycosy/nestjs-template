import { Module } from '@nestjs/common';
import { getLoggerOptions, getConfigModule } from '../../../libs/config/src';
import { WinstonModule } from 'nest-winston';
import { UserApiModule } from './user/UserApiModule';
import { ProductApiModule } from './product/ProductApiModule';
import { OrderApiModule } from './order/OrderApiModule';
import { CartApiModule } from './cart/CartApiModule';
import { CategoryApiModule } from './category/CategoryApiModule';
import { ReviewApiModule } from './review/ReviewApiModule';
import { NoticeApiModule } from './notice';
import { BannerApiModule } from './banner/BannerApiModule';

@Module({
  imports: [
    getConfigModule(),
    WinstonModule.forRoot(getLoggerOptions()),
    ProductApiModule,
    UserApiModule,
    OrderApiModule,
    CartApiModule,
    CategoryApiModule,
    ReviewApiModule,
    NoticeApiModule,
    BannerApiModule,
  ],
})
export class ApiModule {}
