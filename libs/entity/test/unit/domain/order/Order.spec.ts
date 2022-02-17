import { Order } from '@app/entity/domain/order/Order.entity';
import { OrderItem } from '@app/entity/domain/order/OrderItem.entity';
import { PaymentDocument } from '@app/entity/domain/payment/Payment.schema';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';

describe('Order', () => {
  describe('getTotalAmount', () => {
    it('총 주문액을 반환', () => {
      const orderItem1 = new OrderItem();
      orderItem1.setOption(ProductOption.create('detail', 1000, 500));
      orderItem1.quantity = 3;

      const orderItem2 = new OrderItem();
      orderItem2.setOption(ProductOption.create('detail', 5000, 100));
      orderItem2.quantity = 2;

      const order = new Order();
      order.items = [orderItem1, orderItem2];

      expect(order.getTotalAmount()).toBe(11300);
    });
  });

  describe('isForgery', () => {
    it('결제 금액의 위조 여부를 반환', () => {
      const orderItem1 = new OrderItem();
      orderItem1.setOption(ProductOption.create('detail', 1000, 500));
      orderItem1.quantity = 3;

      const orderItem2 = new OrderItem();
      orderItem2.setOption(ProductOption.create('detail', 5000, 100));
      orderItem2.quantity = 2;

      const order = new Order();
      order.items = [orderItem1, orderItem2];

      expect(
        order.isForgery({
          amount: 3000,
        } as PaymentDocument),
      ).toBe(true);
      expect(
        order.isForgery({
          amount: 11300,
        } as PaymentDocument),
      ).toBe(false);
    });
  });
});
