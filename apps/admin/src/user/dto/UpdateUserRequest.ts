import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  password?: string;

  static create(
    name: string,
    email: string,
    phoneNumber: string,
    password?: string,
  ) {
    const request = new UpdateUserRequest();
    request.name = name;
    request.email = email;
    request.phoneNumber = phoneNumber;
    request.password = password;

    return request;
  }
}
