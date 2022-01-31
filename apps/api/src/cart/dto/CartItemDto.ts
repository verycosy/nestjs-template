import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { ProductOptionDto } from '@app/entity/domain/product/dto/ProductOptionDto';
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
    this.option = new ProductOptionDto(option);
  }

  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    status: ProductStatus;
  };
  option: ProductOptionDto;
  quantity: number;
}
