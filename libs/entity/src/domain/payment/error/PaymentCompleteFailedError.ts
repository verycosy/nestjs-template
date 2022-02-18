export class PaymentCompleteFailedError extends Error {
  constructor() {
    super('Payment complete failed');
  }
}
