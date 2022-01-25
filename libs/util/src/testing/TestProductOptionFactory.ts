import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { TestingModule } from '@nestjs/testing';

export class TestProductOptionFactory {
  static async create(
    module: TestingModule,
    product: Product,
    price = 3000,
    detail = 'awesome product',
  ): Promise<ProductOption> {
    const productOption = product.addOption(detail, price);
    await module.get('ProductRepository').save(product);

    return productOption;
  }
}
