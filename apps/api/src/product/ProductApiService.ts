import { Page } from '@app/config/Page';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductApiQueryRepository } from './ProductApiQueryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductsItem, GetProductsRequest } from './dto';

@Injectable()
export class ProductApiService {
  constructor(
    @InjectRepository(ProductApiQueryRepository)
    private readonly productApiQueryRepository: ProductApiQueryRepository,
  ) {}

  async getProducts(param: GetProductsRequest): Promise<Page<GetProductsItem>> {
    const [items, totalCount] = await this.productApiQueryRepository.paging(
      param,
    );

    return new Page<GetProductsItem>(
      totalCount,
      param.pageSize,
      items.map((product) => new GetProductsItem(product)),
    );
  }

  async findProductById(id: number): Promise<Product> {
    return await this.productApiQueryRepository.findByIdOrFail(id);
  }
}
