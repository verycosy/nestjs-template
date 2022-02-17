import { OrderItem } from '../../order/OrderItem.entity';

export class NotReviewableError extends Error {
  constructor(orderItem: OrderItem) {
    super(`Order item #${orderItem.id}(${orderItem.status}) not reviewable`);
  }
}
