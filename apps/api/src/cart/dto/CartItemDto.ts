import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

export class CartItemDto {
  constructor(entity: CartItem) {
    const { id, product, quantity } = entity;

    this.id = id;
    this.product = {
      id: product.id,
      name: product.name,
      price: product.price,
      status: product.status,
    };
    this.quantity = quantity;
  }

  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    status: ProductStatus;
  };
  quantity: number;
}
