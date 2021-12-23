import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { UserApiService } from '../../../src/user/UserApiService';
import { UserAuthApiController } from '../../../src/user/controller';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Repository } from 'typeorm';
import { User } from '@app/entity/domain/user/User.entity';
import { SignUpRequest } from '../../../src/user/dto/SignUpRequest';
import { BadRequestException } from '@nestjs/common';
import { AuthCodeModule, AuthCodeService } from '@app/util/auth-code';
import { getLoggerOptions } from '../../../../../libs/config/src';
import { AuthModule } from '@app/auth';

describe('UserAuthApiController', () => {
  let sut: UserAuthApiController;
  let userRepository: Repository<User>;
  let authCodeService: AuthCodeService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        WinstonModule.forRoot(getLoggerOptions()),
        getTypeOrmTestModule(),
        UserModule,
        AuthCodeModule,
        AuthModule,
      ],
      providers: [UserApiService],
      controllers: [UserAuthApiController],
    }).compile();

    sut = module.get(UserAuthApiController);
    userRepository = module.get('UserRepository');
    authCodeService = module.get(AuthCodeService);
  });

  afterAll(async () => {
    await userRepository.clear();
  });

  describe('signUp', () => {
    it('sms 인증을 받지 않은 상태면 BadRequestException', async () => {
      const request = new SignUpRequest();

      expect(sut.signUp(request)).rejects.toThrowError(
        new BadRequestException('Phone number does not verified'),
      );
    });

    it('비밀번호가 서로 다르면 BadRequestException', async () => {
      jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);

      const request = new SignUpRequest();
      request.password = 'password';
      request.confirmPassword = 'confirmPassword';

      expect(sut.signUp(request)).rejects.toThrowError(
        new BadRequestException('Password does not matched'),
      );
    });

    it('회원가입 성공시 생성된 유저 정보 반환', async () => {
      jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);

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
