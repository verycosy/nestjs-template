import { Expose } from 'class-transformer';

export class IamportToken {
  @Expose({ name: 'access_token' })
  accessToken: string;

  now: number;

  @Expose({ name: 'expired_at' })
  expiredAt: number;
}
