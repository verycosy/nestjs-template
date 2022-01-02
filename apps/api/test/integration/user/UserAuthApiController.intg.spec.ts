import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
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
import { LoginRequest } from '../../../../api/src/user/dto/LoginRequest';
import { WrongPasswordError, UserNotFoundError } from '@app/auth/error';

describe('UserAuthApiController', () => {
  let sut: UserAuthApiController;
  let userRepository: Repository<User>;
  let authCodeService: AuthCodeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        WinstonModule.forRoot(getLoggerOptions()),
        getTypeOrmTestModule(),
        UserModule,
        AuthCodeModule,
        AuthModule,
      ],
      controllers: [UserAuthApiController],
    }).compile();

    sut = module.get(UserAuthApiController);
    userRepository = module.get('UserRepository');
    authCodeService = module.get(AuthCodeService);
  });

  afterEach(async () => {
    await userRepository.clear();
    await userRepository.manager.connection.close();
  });

  async function signUp(email: string, password: string) {
    const user = await User.signUp({
      name: 'verycosy',
      email,
      password,
      phoneNumber: '010-1111-2222',
    });

    return await userRepository.save(user);
  }

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

  describe('login', () => {
    it('회원을 찾지 못하면 UserNotFoundError', () => {
      const request = new LoginRequest();
      request.email = 'verycosyyyyyy@test.com';
      request.password = 'password';

      expect(sut.login(request)).rejects.toThrowError(UserNotFoundError);
    });

    it('비밀번호가 일치하지 않으면 UserNotFoundError', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';

      await signUp(email, password);

      const request = new LoginRequest();
      request.email = email;
      request.password = password + 'oops';

      expect(sut.login(request)).rejects.toThrowError(WrongPasswordError);
    });

    it('refresh token을 갱신하고 회원 정보 반환', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';
      await signUp(email, password);

      const request = new LoginRequest();
      request.email = email;
      request.password = password;

      const result = await sut.login(request);

      expect(result.user.email).toEqual(email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const user = await userRepository.findOne({ email });
      expect(user.refreshToken).toEqual(result.refreshToken);
    });
  });

  describe('logout', () => {
    it('로그아웃 성공 시 refresh token을 null로 설정한다', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';
      await signUp(email, password);

      const loginRequest = new LoginRequest();
      loginRequest.email = email;
      loginRequest.password = password;

      const { user } = await sut.login(loginRequest);

      await sut.logout(user);
      const { refreshToken } = await userRepository.findOne({ id: user.id });
      expect(refreshToken).toBeNull();
    });
  });

  describe('refresh', () => {
    it('refresh token을 갱신하고 새로운 jwt 토큰들을 반환한다', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';
      await signUp(email, password);

      const loginRequest = new LoginRequest();
      loginRequest.email = email;
      loginRequest.password = password;

      const { user } = await sut.login(loginRequest);

      const result = await sut.refresh(user);
      const { refreshToken } = await userRepository.findOne({ id: user.id });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toEqual(refreshToken);
    });
  });
});
