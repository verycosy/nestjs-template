import { IsString } from 'class-validator';

export class ProductInquiryAnswerRequest {
  constructor(answer: string) {
    this.answer = answer;
  }

  @IsString()
  readonly answer: string;
}
