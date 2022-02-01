import { Review } from '@app/entity/domain/review/Review.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestOrderFactory } from '.';

export class TestReviewFactory {
  static async create(module: TestingModule, user: User) {
    const repository = module.get<Repository<Review>>('ReviewRepository');

    const order = await TestOrderFactory.create(module, user);

    return await repository.save(
      Review.create(user, order.items[0], 5, 'this is review'),
    );
  }
}
