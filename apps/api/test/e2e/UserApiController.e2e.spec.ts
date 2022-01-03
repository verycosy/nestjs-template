import { User } from '@app/entity/domain/user/User.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiModule } from '../../../api/src/api.module';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { AuthService } from '@app/auth';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    userRepository = module.get('UserRepository');
    authService = module.get(AuthService);
  });

  afterEach(async () => {
    await userRepository.clear();
    await app.close();
  });

  async function signUp(
    email: string,
    password: string,
    phoneNumber: string,
    name = 'verycosy',
  ) {
    const user = await User.signUp({
      name,
      email,
      password,
      phoneNumber,
    });

    return await userRepository.save(user);
  }

  describe('/me/password (PATCH)', () => {
    const email = 'me-password@test.com';
    const password = 'password';
    const phoneNumber = '010-1111-2222';

    beforeEach(async () => {
      await signUp(email, password, phoneNumber);
    });

    it('기존 비밀번호가 틀린 경우', async () => {
      const { accessToken } = await authService.login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password' + 'oops',
          password: 'this is new password',
          confirmPassword: 'this is new password',
        });

      expect(statusCode).toEqual(500);
    });

    it('기존 비밀번호가 틀린 경우', async () => {
      const { accessToken } = await authService.login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password',
          password: 'this is new password',
          confirmPassword: 'this is wrong new password',
        });

      expect(statusCode).toEqual(400);
    });

    it('새로운 비밀번호로 변경', async () => {
      const { accessToken } = await authService.login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password',
          password: 'this is new password',
          confirmPassword: 'this is new password',
        });

      expect(statusCode).toEqual(200);

      await expect(
        authService.login(email, 'this is new password'),
      ).resolves.not.toThrowError();
    });
  });
});
