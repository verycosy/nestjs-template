import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Category, SubCategory } from '@app/entity/domain/category';
import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductInquiry } from '@app/entity/domain/product-inquiry/ProductInquiry.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { Review } from '@app/entity/domain/review/Review.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Banner } from './domain/banner/Banner.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.RDS_HOST,
        port: Number(process.env.RDS_PORT),
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        dropSchema: process.env.NODE_ENV === 'test',
      }),
    }),
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Category,
      SubCategory,
      Notice,
      Order,
      OrderItem,
      Product,
      ProductOption,
      ProductInquiry,
      Review,
      User,
      Banner,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmTestModule {}
