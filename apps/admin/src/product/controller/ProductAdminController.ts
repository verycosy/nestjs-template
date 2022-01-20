import { AdminGuard } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
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
  ): Promise<ResponseEntity<Product | string>> {
    const { subCategoryId, name, price, detail } = request;

    const product = await this.productAdminService.addProduct(
      subCategoryId,
      name,
      price,
      detail,
    );

    if (product === null) {
      return ResponseEntity.ERROR_WITH(
        'Category not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(product);
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() request: UpdateProductRequest,
  ): Promise<ResponseEntity<Product | string>> {
    const { subCategoryId, name, price, detail, status } = request;

    const updatedProduct = await this.productAdminService.updateProduct(
      id,
      subCategoryId,
      name,
      price,
      detail,
      status,
    );

    if (updatedProduct === null) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(updatedProduct);
  }
}
