export class ForgeryOrderError extends Error {
  constructor(orderAmount: number, paidAmount: number) {
    super(
      `Accept order failed. order amount:${orderAmount}, paid amount:${paidAmount}`,
    );
  }
}
