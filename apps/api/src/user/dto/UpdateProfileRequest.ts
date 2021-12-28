import { IsString } from 'class-validator';

export class UpdateProfileRequest {
  @IsString()
  name: string;
}
