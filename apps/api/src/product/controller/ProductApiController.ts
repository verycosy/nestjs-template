import { ResponseEntity, ResponseStatus } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('/product')
export class ProductApiController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

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
