import { Test } from '@nestjs/testing';
import { UserApiService } from '../../../src/user/UserApiService';
import { UserApiController } from '../../../src/user/UserApiController';
import { TypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Repository } from 'typeorm';
import { User } from '@app/entity/domain/user/User.entity';
import { SignUpRequest } from '../../../../api/src/user/dto/SignUpRequest';
import { BadRequestException } from '@nestjs/common';
import { SignUpService } from '../../../../api/src/user/SignUpService';

describe('UserApiController', () => {
  let sut: UserApiController;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserModule],
      providers: [UserApiService, SignUpService],
      controllers: [UserApiController],
    }).compile();

    sut = module.get(UserApiController);
    userRepository = module.get('UserRepository');
  });

  afterAll(async () => {
    await userRepository.clear();
  });

  describe('signUp', () => {
    it('비밀번호가 서로 다르면 BadRequestException', async () => {
      const request = new SignUpRequest();
      request.password = 'password';
      request.confirmPassword = 'confirmPassword';

      expect(sut.signUp(request)).rejects.toThrowError(
        new BadRequestException('Password does not matched'),
      );
    });

    it('회원가입 성공시 생성된 유저 정보 반환', async () => {
      const request = new SignUpRequest();
      request.name = 'verycosy';
      request.email = 'test@test.com';
      request.password = 'password';
      request.confirmPassword = 'password';
      request.phoneNumber = '010-1111-2222';

      const result = await sut.signUp(request);
      expect(result.email).toEqual(request.email);
    });
  });
});
