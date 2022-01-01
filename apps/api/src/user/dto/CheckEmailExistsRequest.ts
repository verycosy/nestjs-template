import { IsString } from 'class-validator';

export class CheckEmailExistsRequest {
  @IsString()
  email: string;
}
