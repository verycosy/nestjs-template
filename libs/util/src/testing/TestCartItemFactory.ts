import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { TestingModule } from '@nestjs/testing';

export class TestCartItemFactory {
  static async create(
    module: TestingModule,
    cart: Cart,
    product: Product,
    option: ProductOption,
    quantity = 1,
  ) {
    await module
      .get('CartItemRepository')
      .save(CartItem.create(cart, product, option, quantity));
  }
}
