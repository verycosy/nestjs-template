import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

export class CartItemDto {
  constructor(entity: CartItem) {
    const { id, product, quantity, option } = entity;

    this.id = id;
    this.product = {
      id: product.id,
      name: product.name,
      price: product.price,
      status: product.status,
    };
    this.quantity = quantity;
    this.option = option;
  }

  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    status: ProductStatus;
  };
  option: ProductOption;
  quantity: number;
}
