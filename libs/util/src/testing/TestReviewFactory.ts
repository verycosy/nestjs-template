import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { Review } from '@app/entity/domain/review/Review.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestOrderFactory } from '.';

export class TestReviewFactory {
  static async create(
    module: TestingModule,
    user: User,
    product?: Product,
    productOption?: ProductOption,
  ) {
    const repository = module.get<Repository<Review>>('ReviewRepository');

    const order = await TestOrderFactory.create(
      module,
      user,
      product,
      productOption,
    );

    return await repository.save(
      Review.create(user, order.items[0], 5, 'this is review'),
    );
  }
}
