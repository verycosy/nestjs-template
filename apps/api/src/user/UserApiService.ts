import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserApiService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async updateProfile(
    user: User,
    uploadedProfileImageUrl: string,
  ): Promise<void> {
    user.profileImageUrl = uploadedProfileImageUrl;
    await this.userRepository.save(user);
  }
}
