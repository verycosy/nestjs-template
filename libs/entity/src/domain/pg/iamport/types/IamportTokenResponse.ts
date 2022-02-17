import { IamportResponse } from './IamportResponse';

interface IamportToken {
  access_token: string;
  now: number;
  expired_at: number;
}

export type IamportTokenResponse = IamportResponse<IamportToken>;
