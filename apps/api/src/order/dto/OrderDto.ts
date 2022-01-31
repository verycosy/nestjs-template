import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItemDto } from './OrderItemDto';

export class OrderDto {
  constructor(entity: Order) {
    this.id = entity.id;
    this.items = entity.items.map((item) => new OrderItemDto(item));
  }

  id: number;
  items: OrderItemDto[];
}
