import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';

export class OrderItemDto {
  constructor(entity: OrderItem) {
    this.id = entity.id;
    this.quantity = entity.getQuantity();
    this.optionDetail = entity.getOptionDetail();
    this.optionPrice = entity.getOptionPrice();
    this.productName = entity.getProductName();
  }

  id: number;
  quantity: number;
  optionPrice: number;
  optionDetail: string;
  productName: string;
}
