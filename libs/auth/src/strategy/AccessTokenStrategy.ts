import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import JwtStrategy from './JwtStrategy';

@Injectable()
export class AccessTokenStrategy extends JwtStrategy {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {
    super(process.env.ACCESS_TOKEN_SECRET, 'access-token-jwt');
  }
}
