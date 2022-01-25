import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderStatus } from '@app/entity/domain/order/type/OrderStatus';
import { OrderItemDto } from './OrderItemDto';

export class OrderDto {
  constructor(entity: Order) {
    this.id = entity.id;
    this.status = entity.getStatus();
    this.items = entity.items.map((item) => new OrderItemDto(item));
  }

  id: number;
  status: OrderStatus;
  items: OrderItemDto[];
}
