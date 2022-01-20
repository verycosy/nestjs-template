import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  password?: string;

  static create(name: string, phoneNumber: string, password?: string) {
    const dto = new UpdateUserRequest();
    dto.name = name;
    dto.phoneNumber = phoneNumber;
    dto.password = password;

    return dto;
  }
}
