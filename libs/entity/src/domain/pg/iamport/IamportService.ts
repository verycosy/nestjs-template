import { Injectable } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Payment } from '../../payment/Payment.schema';
import { PgService } from '../PgService';
import { iamportRequest } from './iamportRequest';
import { IamportResponse, IamportPayment, IamportToken } from './types';

@Injectable()
export class IamportService implements PgService {
  private getRequest() {
    return iamportRequest;
  }

  private async getIamportAccessToken(): Promise<string> {
    const { data } = await this.getRequest().post<
      IamportResponse<IamportToken>
    >(`/users/getToken`, {
      imp_key: process.env.IMP_KEY,
      imp_secret: process.env.IMP_SECRET,
    });

    const {
      response: { accessToken },
    } = plainToClassFromExist(
      new IamportResponse<IamportToken>(IamportToken),
      data,
    );

    return accessToken;
  }

  async getPayment(impUid: string): Promise<Payment> {
    const { data } = await this.getRequest().get<
      IamportResponse<IamportPayment>
    >(`/payments/${impUid}`, {
      headers: {
        Authorization: await this.getIamportAccessToken(),
      },
    });

    const { response } = plainToClassFromExist(
      new IamportResponse<IamportPayment>(IamportPayment),
      data,
    );

    return plainToClass(Payment, response);
  }

  async cancelPayment(
    merchantUid: string,
    reason: string,
    checksum: number,
    cancelRequestAmount?: number,
  ): Promise<Payment> {
    const { data } = await this.getRequest().post<
      IamportResponse<IamportPayment>
    >(
      `/payments/cancel`,
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

    const { response } = plainToClassFromExist(
      new IamportResponse<IamportPayment>(IamportPayment),
      data,
    );

    return plainToClass(Payment, response);
  }
}
