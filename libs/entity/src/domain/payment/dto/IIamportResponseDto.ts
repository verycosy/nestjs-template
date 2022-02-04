import { Payment } from '../Payment.schema';

export interface IIamportResponseDto {
  code: number;
  message: string;
  response: Payment;
}
