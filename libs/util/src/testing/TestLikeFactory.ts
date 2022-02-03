import { Product } from '@app/entity/domain/product/Product.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

export class TestLikeFactory {
  static async create(module: TestingModule, user: User, product: Product) {
    const repository = module.get<Repository<User>>('UserRepository');

    (await user.liked).push(product);

    await repository.save(user);
  }
}
