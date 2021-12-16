import { User } from '@app/entity/domain/user/User.entity';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SignUpRequest } from './dto/SignUpRequest';
import { SignUpService } from './SignUpService';

@Controller('/users')
export class UserApiController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    if (!request.isEqualPassword()) {
      throw new BadRequestException('Password does not matched');
    }

    return await this.signUpService.signUp(await request.toEntity());
  }
}
