import { IsString } from 'class-validator';

export class FindEmailRequest {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;
}
