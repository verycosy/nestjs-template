import { WrongPasswordError } from '@app/auth/error';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async updateUserById(
    userId: number,
    name: string,
    phoneNumber: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ id: userId });

    await user.update(name, phoneNumber, password);
    return await this.userRepository.save(user);
  }

  async updateProfile(
    user: User,
    uploadedProfileImageUrl: string,
  ): Promise<void> {
    user.profileImageUrl = uploadedProfileImageUrl;
    await this.userRepository.save(user);
  }

  async updatePhoneNumber(user: User, newPhoneNumber: string): Promise<void> {
    user.phoneNumber = newPhoneNumber;
    await this.userRepository.save(user);
  }

  async changePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (await user.validatePassword(oldPassword)) {
      await user.changePassword(newPassword);
      await this.userRepository.save(user);
      return;
    }

    throw new WrongPasswordError();
  }
}
