import { Page } from '@app/config/Page';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductsItem, GetProductsRequest } from '../dto';
import { ProductApiService } from '../ProductApiService';

@Controller('/product')
export class ProductApiController {
  constructor(private readonly productApiService: ProductApiService) {}

  async getProducts(
    @Query() query: GetProductsRequest,
  ): Promise<Page<GetProductsItem>> {
    return await this.productApiService.getProducts(query);
  }

  @Get('/:id')
  async findProduct(
    @Param('id') id: number,
  ): Promise<ResponseEntity<Product | string>> {
    const product = await this.productApiService.findProductById(id);

    if (product === null) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(product);
  }
}
