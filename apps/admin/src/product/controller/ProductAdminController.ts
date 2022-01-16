import { AdminGuard } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { Product } from '@app/entity/domain/product/Product.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddProductRequest } from '../dto/AddProductRequest';

@AdminGuard()
@Controller('/product')
export class ProductAdminController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Post()
  async addProduct(
    @Body() request: AddProductRequest,
  ): Promise<ResponseEntity<Product>> {
    const { name, price, detail } = request;
    const product = await this.productRepository.save(
      Product.create(name, price, detail),
    );

    return ResponseEntity.OK_WITH(product);
  }
}
