import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { UserAuthApiController } from '../../../src/user/controller';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { Repository } from 'typeorm';
import { User } from '@app/entity/domain/user/User.entity';
import { SignUpRequest } from '../../../src/user/dto/SignUpRequest';
import { BadRequestException } from '@nestjs/common';
import { AuthCodeModule, AuthCodeService } from '@app/util/auth-code';
import {
  getConfigModule,
  getLoggerOptions,
} from '../../../../../libs/config/src';
import { AuthModule } from '@app/auth';
import { LoginRequest } from '../../../../api/src/user/dto/LoginRequest';
import { WrongPasswordError, UserNotFoundError } from '@app/auth/error';
import { Role } from '@app/entity/domain/user/type/Role';
import { ProductModule } from '@app/entity/domain/product/ProductModule';

describe('UserAuthApiController', () => {
  let sut: UserAuthApiController;
  let module: TestingModule;
  let userRepository: Repository<User>;
  let authCodeService: AuthCodeService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        WinstonModule.forRoot(getLoggerOptions()),
        getTypeOrmTestModule(),
        UserModule,
        AuthCodeModule,
        AuthModule,
        ProductModule,
      ],
      controllers: [UserAuthApiController],
    }).compile();

    sut = module.get(UserAuthApiController);
    userRepository = module.get('UserRepository');
    authCodeService = module.get(AuthCodeService);
  });

  afterEach(async () => {
    await module.close();
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
      const request = SignUpRequest.create({
        phoneNumber: '010-1111-2222',
      });

      try {
        await sut.signUp(request);
      } catch (err) {
        expect(err instanceof BadRequestException).toBe(true);
        expect(err.message).toBe('010-1111-2222 does not verified');
      }
    });

    it('비밀번호가 서로 다르면 BadRequestException', async () => {
      jest.spyOn(authCodeService, 'checkVerified').mockResolvedValue(undefined);

      const request = SignUpRequest.create({
        password: 'password',
        confirmPassword: 'confirmPassword',
      });

      expect(sut.signUp(request)).rejects.toThrowError(
        new BadRequestException('Password does not matched'),
      );
    });

    it('회원가입 성공시 생성된 유저 정보 반환', async () => {
      jest.spyOn(authCodeService, 'checkVerified').mockResolvedValue(undefined);
      const request = SignUpRequest.create({
        name: 'verycosy',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
        phoneNumber: '010-1111-2222',
      });

      const result = await sut.signUp(request);

      expect(result.email).toEqual(request.email);
    });
  });

  describe('login', () => {
    it('회원을 찾지 못하면 UserNotFoundError', async () => {
      const request = LoginRequest.create(
        Role.Customer,
        'verycosyyyyyy@test.com',
        'password',
      );

      try {
        await sut.login(request);
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundError);
      }
    });

    it('비밀번호가 일치하지 않으면 WrongPasswordError', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';

      await signUp(email, password);

      const request = LoginRequest.create(
        Role.Customer,
        email,
        password + 'oops',
      );

      try {
        await sut.login(request);
      } catch (err) {
        expect(err).toBeInstanceOf(WrongPasswordError);
      }
    });

    it('refresh token을 갱신하고 회원 정보 반환', async () => {
      const email = 'verycosy@test.com';
      const password = 'password';
      await signUp(email, password);

      const request = LoginRequest.create(Role.Customer, email, password);

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

      const loginRequest = LoginRequest.create(Role.Customer, email, password);

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

      const loginRequest = LoginRequest.create(Role.Customer, email, password);

      const { user } = await sut.login(loginRequest);

      const result = await sut.refresh(user);
      const { refreshToken } = await userRepository.findOne({ id: user.id });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toEqual(refreshToken);
    });
  });
});
