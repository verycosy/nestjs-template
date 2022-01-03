import { IsString } from 'class-validator';
import { ConfirmPasswordRequest } from './ConfirmPasswordRequest';

export class ChangePasswordRequest extends ConfirmPasswordRequest {
  @IsString()
  oldPassword: string;
}
