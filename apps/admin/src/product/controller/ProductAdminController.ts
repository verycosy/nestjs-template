import { AdminGuard } from '@app/auth';
import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { ProductOptionDto } from '@app/entity/domain/product/dto/ProductOptionDto';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AddProductRequest, ProductDto, UpdateProductRequest } from '../dto';
import { AddProductOptionRequest } from '../dto/AddProductOptionRequest';
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
  ): Promise<ResponseEntity<ProductDto | string>> {
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

    return ResponseEntity.OK_WITH(new ProductDto(updatedProduct));
  }

  @Post('/:id')
  async addProductOption(
    @Param('id') id: number,
    @Body() body: AddProductOptionRequest,
  ): Promise<ResponseEntity<ProductOptionDto | string>> {
    const { detail, price, discount } = body;

    const productOption = await this.productAdminService.addProductOption(
      id,
      detail,
      price,
      discount,
    );

    if (productOption === null) {
      return ResponseEntity.ERROR_WITH(
        'Product not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new ProductOptionDto(productOption));
  }

  @Patch('/option/:productOptionId')
  async updateProductOption(
    @Param('productOptionId') id: number,
    @Body() body: AddProductOptionRequest,
  ): Promise<ResponseEntity<ProductOptionDto | string>> {
    const { detail, price, discount } = body;

    const productOption = await this.productAdminService.updateProductOption(
      id,
      detail,
      price,
      discount,
    );

    if (productOption === null) {
      return ResponseEntity.ERROR_WITH(
        'Product option not found',
        ResponseStatus.NOT_FOUND,
      );
    }

    return ResponseEntity.OK_WITH(new ProductOptionDto(productOption));
  }
}
