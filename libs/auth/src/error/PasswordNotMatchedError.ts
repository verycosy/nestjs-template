export class PasswordNotMatchedError extends Error {
  constructor() {
    super('Password not matched');
  }
}
