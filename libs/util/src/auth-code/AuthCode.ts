export class AuthCode {
  constructor(private readonly value: string) {
    if (value.length !== 6) {
      throw new Error('invalid auth code');
    }

    this.value = value;
  }

  get(): string {
    return this.value;
  }

  equals(authCode: AuthCode): boolean {
    return this.value === authCode.value;
  }
}
