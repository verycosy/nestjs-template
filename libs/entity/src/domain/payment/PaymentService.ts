import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import {
  IamportPaymentData,
  IamportPaymentDataResponse,
  IamportTokenResponse,
} from './iamport/types';
import { Payment, PaymentDocument } from './Payment.schema';

@Injectable()
export class PaymentService {
  private static readonly IAMPORT_API_URL = 'https://api.iamport.kr';

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  private async getIamportAccessToken(): Promise<string> {
    const { data } = await axios.post<IamportTokenResponse>(
      `${PaymentService.IAMPORT_API_URL}/users/getToken`,
      {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      },
    );

    return data.response.access_token;
  }

  private async getIamportPaymentData(impUid: string) {
    const { data } = await axios.get<IamportPaymentDataResponse>(
      `${PaymentService.IAMPORT_API_URL}/payments/${impUid}`,
      {
        headers: {
          Authorization: await this.getIamportAccessToken(),
        },
      },
    );

    return data.response;
  }

  private async cancelIamportPayment(
    impUid: string,
    reason: string,
    checksum: number,
    cancelRequestAmount?: number,
  ): Promise<IamportPaymentData> {
    const { data } = await axios.post<IamportPaymentDataResponse>(
      `${PaymentService.IAMPORT_API_URL}/payments/cancel`,
      {
        reason,
        impUid,
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

  async complete(impUid: string): Promise<IamportPaymentData> {
    return await this.getIamportPaymentData(impUid);
  }

  async cancel(
    merchantUid: string,
    reason: string,
    cancelRequestAmount?: number,
  ): Promise<IamportPaymentData> {
    const payment = await this.paymentModel.findOne({
      merchant_uid: merchantUid,
    });

    if (!payment) {
      return null;
    }

    const response = await this.cancelIamportPayment(
      payment.imp_uid,
      reason,
      payment.getCancelableAmount(),
      cancelRequestAmount,
    );

    await payment.update(response, { new: true });
    return response;
  }

  async save(iamportPaymentData: IamportPaymentData): Promise<PaymentDocument> {
    return await this.paymentModel.create(iamportPaymentData);
  }
}
