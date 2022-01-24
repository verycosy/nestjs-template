export class ProductInquiryAlreadyCompletedError extends Error {
  constructor() {
    super('Product inquiry already completed');
  }
}
