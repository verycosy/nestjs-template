import { IsString } from 'class-validator';

export class WriteProductInquiryRequest {
  @IsString()
  content: string;

  static create(content: string): WriteProductInquiryRequest {
    const dto = new WriteProductInquiryRequest();
    dto.content = content;

    return dto;
  }
}
