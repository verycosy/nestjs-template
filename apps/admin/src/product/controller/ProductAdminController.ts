import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { ProductOptionDto } from '@app/entity/domain/product/dto/ProductOptionDto';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AddProductRequest, ProductDto, UpdateProductRequest } from '../dto';
import { AddProductOptionRequest } from '../dto/AddProductOptionRequest';
import { ProductService } from '@app/entity/domain/product/ProductService';

@AdminGuard()
@Controller('/product')
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async addProduct(
    @Body() request: AddProductRequest,
  ): Promise<ResponseEntity<Product | string>> {
    const { subCategoryId, name, price, detail } = request;

    const product = await this.productService.addProduct(
      subCategoryId,
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
  ): Promise<ResponseEntity<ProductDto | string>> {
    const { subCategoryId, name, price, detail, status } = request;

    const updatedProduct = await this.productService.updateProduct(
      id,
      subCategoryId,
      name,
      price,
      detail,
      status,
    );

    return ResponseEntity.OK_WITH(new ProductDto(updatedProduct));
  }

  @Post('/:id')
  async addProductOption(
    @Param('id') id: number,
    @Body() body: AddProductOptionRequest,
  ): Promise<ResponseEntity<ProductOptionDto | string>> {
    const { detail, price, discount } = body;

    const productOption = await this.productService.addProductOption(
      id,
      detail,
      price,
      discount,
    );

    return ResponseEntity.OK_WITH(new ProductOptionDto(productOption));
  }

  @Patch('/option/:productOptionId')
  async updateProductOption(
    @Param('productOptionId') id: number,
    @Body() body: AddProductOptionRequest,
  ): Promise<ResponseEntity<ProductOptionDto | string>> {
    const { detail, price, discount } = body;

    const productOption = await this.productService.updateProductOption(
      id,
      detail,
      price,
      discount,
    );

    return ResponseEntity.OK_WITH(new ProductOptionDto(productOption));
  }
}
