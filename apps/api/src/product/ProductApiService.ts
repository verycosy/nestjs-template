import { Page } from '@app/config/Page';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductQueryRepository } from '@app/entity/domain/product/ProductQueryRepository';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductsItem, GetProductsRequest } from './dto';

@Injectable()
export class ProductApiService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductQueryRepository)
    private readonly productQueryRepository: ProductQueryRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProducts(param: GetProductsRequest): Promise<Page<GetProductsItem>> {
    const [items, totalCount] = await this.productQueryRepository.paging(param);

    return new Page<GetProductsItem>(
      totalCount,
      param.pageSize,
      items.map((product) => new GetProductsItem(product)),
    );
  }

  async findProductById(id: number): Promise<Product> {
    return await this.productRepository.findOneOrFail({ id });
  }

  async like(id: number, user: User): Promise<Product> {
    const product = await this.productRepository.findOneOrFail({ id });

    (await user.liked).push(product);
    await this.userRepository.save(user);

    return product;
  }

  async cancelLike(productId: number, user: User): Promise<void> {
    const liked = await user.liked;

    user.liked = Promise.resolve(
      liked.filter((product) => product.id !== productId),
    );

    await this.userRepository.save(user);
  }
}
