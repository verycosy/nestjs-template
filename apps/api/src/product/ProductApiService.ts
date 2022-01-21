import { Page } from '@app/config/Page';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductQueryRepository } from '@app/entity/domain/product/ProductQueryRepository';
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
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      return null;
    }

    return product;
  }
}
