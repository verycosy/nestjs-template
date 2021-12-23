import { IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
