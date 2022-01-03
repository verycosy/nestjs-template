export class InvalidAuthCodeError extends Error {
  constructor(value: string) {
    super(`${value} is invalid auth code`);
  }
}
