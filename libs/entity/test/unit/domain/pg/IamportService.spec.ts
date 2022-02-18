import { IamportService } from '@app/entity/domain/pg';
import { anything, instance, mock, when } from 'ts-mockito';
import { AxiosResponse, Axios } from 'axios';
import { iamportPaymentMockData } from '../../../../../../libs/entity/test/integration/domain/payment/mockData';
import { Payment } from '@app/entity/domain/payment/Payment.schema';

describe('IamportService', () => {
  let sut: IamportService;

  beforeAll(() => {
    const mockedAxios = mock<Axios>();

    when(mockedAxios.post('/users/getToken', anything())).thenResolve({
      data: {
        code: 0,
        message: '',
        response: {
          access_token: 'iamport access token',
          now: 0,
          expiredAt: 0,
        },
      },
    } as AxiosResponse);

    when(mockedAxios.get('/payments/impUid', anything())).thenResolve({
      data: {
        code: 0,
        message: '',
        response: iamportPaymentMockData,
      },
    } as AxiosResponse);

    jest
      .spyOn(IamportService.prototype, 'getRequest' as any)
      .mockReturnValue(instance(mockedAxios));

    sut = new IamportService();
  });

  describe('getPayment', () => {
    it('아임포트 결제데이터를 payment 객체로 반환', async () => {
      const payment = await sut.getPayment('impUid');

      expect(payment instanceof Payment).toBe(true);
      expect(payment.impUid).toBe('imp_313817088792');
    });
  });
});
