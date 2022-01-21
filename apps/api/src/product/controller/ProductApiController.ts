import { Page } from '@app/config/Page';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductQueryRepository } from '@app/entity/domain/product/ProductQueryRepository';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductsItem } from '../dto/GetProductsItem';
import { GetProductsRequest } from '../dto/GetProductsRequest';

@Controller('/product')
export class ProductApiController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductQueryRepository)
    private readonly productQueryRepository: ProductQueryRepository,
  ) {}

  async getProducts(
    @Query() query: GetProductsRequest,
  ): Promise<Page<GetProductsItem>> {
    const [items, totalCount] = await this.productQueryRepository.paging(query);

    return new Page<GetProductsItem>(
      totalCount,
      query.pageSize,
      items.map((product) => new GetProductsItem(product)),
    );
  }

  @Get('/:id')
  async findProduct(
    @Param('id') id: number,
  ): Promise<ResponseEntity<Product | string>> {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(product);
  }
}
