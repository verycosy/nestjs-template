import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AddProductRequest, UpdateProductRequest } from '../dto';
import { ProductAdminService } from '../ProductAdminService';

@AdminGuard()
@Controller('/product')
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @Post()
  async addProduct(
    @Body() request: AddProductRequest,
  ): Promise<ResponseEntity<Product>> {
    const { name, price, detail } = request;

    const product = await this.productAdminService.addProduct(
      name,
      price,
      detail,
    );

    return ResponseEntity.OK_WITH(product);
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() request: UpdateProductRequest,
  ): Promise<ResponseEntity<Product | string>> {
    const { name, price, detail, status } = request;

    const updatedProduct = await this.productAdminService.updateProduct(
      id,
      name,
      price,
      detail,
      status,
    );

    if (updatedProduct === null) {
      return ResponseEntity.ERROR_WITH('Product not found');
    }

    return ResponseEntity.OK_WITH(updatedProduct);
  }
}
