import { Injectable } from '@nestjs/common';
import { IIamportResponseDto } from './dto/IIamportResponseDto';
import { Payment } from './Payment.schema';

@Injectable()
export class PaymentService {
  private async getIamportAccessToken(): Promise<string> {
    return 'access token';
  }

  async complete(impUid: string): Promise<IIamportResponseDto> {
    const iamportAccessToken = await this.getIamportAccessToken();

    return {
      code: 0,
      message: 'hi',
      response: new Payment(),
    };
  }
}
