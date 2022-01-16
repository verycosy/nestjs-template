import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { AddProductRequest } from '../dto/AddProductRequest';
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
}
