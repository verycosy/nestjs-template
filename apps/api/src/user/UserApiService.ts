import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserApiService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  sayHello() {
    return 'hello';
  }

  async signUp(newUser: User): Promise<User> {
    return await this.userRepository.save(newUser);
  }
}
