import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PgService } from '../PgService';
import {
  IamportPayment,
  IamportPaymentResponse,
  IamportTokenResponse,
} from './types';

@Injectable()
export class IamportService implements PgService {
  private static readonly API_URL = 'https://api.iamport.kr';

  private async getIamportAccessToken(): Promise<string> {
    const { data } = await axios.post<IamportTokenResponse>(
      `${IamportService.API_URL}/users/getToken`,
      {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      },
    );

    return data.response.access_token;
  }

  async getPayment(impUid: string): Promise<IamportPayment> {
    const { data } = await axios.get<IamportPaymentResponse>(
      `${IamportService.API_URL}/payments/${impUid}`,
      {
        headers: {
          Authorization: await this.getIamportAccessToken(),
        },
      },
    );

    return data.response;
  }

  async cancelPayment(
    merchantUid: string,
    reason: string,
    checksum: number,
    cancelRequestAmount?: number,
  ): Promise<IamportPayment> {
    const { data } = await axios.post<IamportPaymentResponse>(
      `${IamportService.API_URL}/payments/cancel`,
      {
        reason,
        merchant_uid: merchantUid,
        amount: cancelRequestAmount, // NOTE: undefined이면 전액취소
        checksum,
      },
      {
        headers: {
          Authorization: await this.getIamportAccessToken(),
        },
      },
    );

    return data.response;
  }
}
