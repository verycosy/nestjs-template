import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderItemStatus } from '@app/entity/domain/order/type/OrderItemStatus';

export class OrderItemDto {
  constructor(entity: OrderItem) {
    this.id = entity.id;
    this.quantity = entity.getQuantity();
    this.optionDetail = entity.getOptionDetail();
    this.optionPrice = entity.getOptionPrice();
    this.productName = entity.getProductName();
    this.status = entity.getStatus();
    this.optionDiscount = entity.getOptionDiscount();
  }

  id: number;
  quantity: number;
  optionPrice: number;
  optionDetail: string;
  optionDiscount: number;
  productName: string;
  status: OrderItemStatus;
}
