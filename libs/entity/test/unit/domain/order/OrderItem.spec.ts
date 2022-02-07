import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';

describe('OrderItem', () => {
  describe('getAmount', () => {
    it('주문 항목의 총액을 반환한다', () => {
      const orderItem = new OrderItem();
      orderItem.setOption(ProductOption.create('detail', 1000, 500));
      orderItem.setQuantity(3);

      const amount = orderItem.getAmount();

      expect(amount).toBe(1500);
    });
  });
});
