export class AuthCode {
  constructor(private readonly value: string) {
    if (value.length !== 6) {
      throw new Error('invalid auth code');
    }

    this.value = value;
  }

  static generate() {
    if (process.env.NODE_ENV === 'test') {
      return new AuthCode('123456');
    }

    const MIN = 100000;
    const MAX = 999999;

    return new AuthCode(
      (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString(),
    );
  }

  get(): string {
    return this.value;
  }

  equals(authCode: AuthCode): boolean {
    return this.value === authCode.value;
  }
}
