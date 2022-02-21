import { AccessTokenGuard, CurrentUser } from '@app/auth';
import { Page } from '@app/config/Page';
import { ResponseEntity } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductService } from '@app/entity/domain/product/ProductService';
import { User } from '@app/entity/domain/user/User.entity';
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GetProductsItem, GetProductsRequest } from '../dto';
import { ProductApiService } from '../ProductApiService';

@Controller('/product')
export class ProductApiController {
  constructor(
    private readonly productApiService: ProductApiService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async getProducts(
    @Query() query: GetProductsRequest,
  ): Promise<Page<GetProductsItem>> {
    return await this.productApiService.getProducts(query);
  }

  @Get('/:id')
  async findProduct(@Param('id') id: number): Promise<ResponseEntity<Product>> {
    const product = await this.productApiService.findProductById(id);
    return ResponseEntity.OK_WITH(product);
  }

  @AccessTokenGuard()
  @Post('/:id/like')
  async like(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<Product>> {
    const likedProduct = await this.productService.like(id, user);
    return ResponseEntity.OK_WITH(likedProduct);
  }

  @AccessTokenGuard()
  @Delete('/:id/like')
  async cancelLike(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<string>> {
    await this.productService.cancelLike(id, user);
    return ResponseEntity.OK();
  }
}
