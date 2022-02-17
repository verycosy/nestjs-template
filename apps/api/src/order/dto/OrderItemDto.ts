import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { OrderItemStatus } from '@app/entity/domain/order/type/OrderItemStatus';

export class OrderItemDto {
  constructor(entity: OrderItem) {
    this.id = entity.id;
    this.quantity = entity.quantity;
    this.optionDetail = entity.optionDetail;
    this.optionPrice = entity.optionPrice;
    this.productName = entity.productName;
    this.status = entity.status;
    this.optionDiscount = entity.optionDiscount;
  }

  id: number;
  quantity: number;
  optionPrice: number;
  optionDetail: string;
  optionDiscount: number;
  productName: string;
  status: OrderItemStatus;
}
