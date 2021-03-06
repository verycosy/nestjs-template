import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InvalidAuthCodeError } from './error';

export class AuthCode {
  constructor(private readonly value: string) {
    if (value.length !== 6) {
      throw new InvalidAuthCodeError(value);
    }

    this.value = value;
  }

  static generate() {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local') {
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

export function AuthCodeApiProperty() {
  return applyDecorators(
    ApiProperty({
      type: 'string',
      description: '인증코드(6자리)',
      minLength: 6,
      maxLength: 6,
    }),
  );
}
