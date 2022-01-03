export class NotVerifiedError extends Error {
  constructor(emailOrPhoneNumber: string) {
    super(`${emailOrPhoneNumber} does not verified`);
  }
}
