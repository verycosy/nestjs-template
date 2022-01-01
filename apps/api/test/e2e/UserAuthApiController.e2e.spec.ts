import { CACHE_MANAGER, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Cache } from 'cache-manager';
import { ApiModule } from '../../src/api.module';

describe('UserAuthApiController (e2e)', () => {
  let app: INestApplication;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(async () => {
    await app.close();
    await cacheManager.reset();
  });

  async function authSms(phoneNumber: string) {
    const url = '/users/sms';

    await request(app.getHttpServer()).post(url).send({
      phoneNumber,
    });

    await request(app.getHttpServer()).patch(url).send({
      phoneNumber,
      authCode: '123456',
    });
  }

  async function signUp(email: string, password: string, phoneNumber: string) {
    await authSms(phoneNumber);

    return await request(app.getHttpServer()).post('/users/sign-up').send({
      name: 'verycosy',
      email,
      password,
      phoneNumber,
      confirmPassword: password,
    });
  }

  async function login(email: string, password: string) {
    return await request(app.getHttpServer()).post('/users/login').send({
      email,
      password,
    });
  }

  describe('/sign-up (POST)', () => {
    it('인증되지 않은 휴대폰 번호는 에러 메시지', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          name: 'verycosy',
          email: 'test@test.com',
          password: 'password',
          phoneNumber: '010-1111-2222',
          confirmPassword: 'confirmPassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: 'Bad Request',
        message: 'Phone number does not verified',
        statusCode: 400,
      });
    });

    it('비밀번호가 서로 다르면 에러 메시지', async () => {
      const phoneNumber = '010-1111-2222';
      await authSms(phoneNumber);

      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          name: 'verycosy',
          email: 'test@test.com',
          password: 'password',
          phoneNumber,
          confirmPassword: 'confirmPassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: 'Bad Request',
        message: 'Password does not matched',
        statusCode: 400,
      });
    });

    it('가입된 유저 정보 반환', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      const res = await signUp(email, password, phoneNumber);

      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toEqual(email);
      expect(res.body.phoneNumber).toEqual(phoneNumber);
    });
  });

  describe('/login (POST)', () => {
    it('존재하지 않는 계정이면 error', async () => {
      const res = await request(app.getHttpServer()).post('/users/login').send({
        email: 'test@test.com',
        password: 'passwood',
      });

      expect(res.statusCode).toEqual(500);
    });

    it('비밀번호가 일치하지 않으면 error', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);

      const res = await request(app.getHttpServer()).post('/users/login').send({
        email,
        password: 'passwood',
      });

      expect(res.statusCode).toEqual(500);
    });

    it('회원 정보와 jwt 토큰 반환', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);
      const { body, statusCode } = await login(email, password);

      expect(statusCode).toEqual(201);
      expect(body.user.email).toEqual(email);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
    });
  });

  it('/logout (GET)', async () => {
    const email = 'test@test.com';
    const password = 'password';
    const phoneNumber = '010-1111-2222';

    await signUp(email, password, phoneNumber);
    const {
      body: { accessToken },
    } = await login(email, password);

    const { statusCode } = await request(app.getHttpServer())
      .get('/users/logout')
      .set('Authorization', 'Bearer ' + accessToken);
    expect(statusCode).toEqual(200);
  });

  describe('/refresh (PATCH)', () => {
    async function refresh() {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);
      const {
        body: { refreshToken: oldRefreshToken },
      } = await login(email, password);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1000);
      });

      const { body, statusCode } = await request(app.getHttpServer())
        .patch('/users/refresh')
        .set('Authorization', 'Bearer ' + oldRefreshToken);

      return { body, statusCode, oldRefreshToken };
    }

    it('새로운 인증 토큰을 반환한다', async () => {
      const { body, statusCode, oldRefreshToken } = await refresh();

      expect(statusCode).toEqual(200);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      expect(body.refreshToken).not.toEqual(oldRefreshToken);
    });

    it('대체된 refresh token으로 갱신 시도 시 error', async () => {
      const { oldRefreshToken } = await refresh();

      const res = await request(app.getHttpServer())
        .patch('/users/refresh')
        .set('Authorization', 'Bearer ' + oldRefreshToken);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('/password (PATCH)', () => {
    it('기존 비밀번호가 틀린 경우', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);
      const {
        body: { accessToken },
      } = await login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password' + 'oops',
          newPassword: 'this is new password',
          confirmNewPassword: 'this is new password',
        });

      expect(statusCode).toEqual(500);
    });

    it('기존 비밀번호가 틀린 경우', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);
      const {
        body: { accessToken },
      } = await login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password',
          newPassword: 'this is new password',
          confirmNewPassword: 'this is wrong new password',
        });

      expect(statusCode).toEqual(400);
    });

    it('새로운 비밀번호로 변경', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      await signUp(email, password, phoneNumber);
      const {
        body: { accessToken },
      } = await login(email, password);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/users/password')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          oldPassword: 'password',
          newPassword: 'this is new password',
          confirmNewPassword: 'this is new password',
        });

      expect(statusCode).toEqual(200);

      const { statusCode: loginStatusCode } = await login(
        email,
        'this is new password',
      );
      expect(loginStatusCode).toEqual(201);
    });
  });

  describe('/check-email', () => {
    it('가입된 이메일이 있는지 확인', async () => {
      const email = 'exists@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/users/check-email')
        .send({ email });

      expect(statusCode).toEqual(201);
      expect(body.exists).toEqual(false);

      await signUp(email, password, phoneNumber);

      const result = await request(app.getHttpServer())
        .post('/users/check-email')
        .send({ email });

      expect(result.statusCode).toEqual(201);
      expect(result.body.exists).toEqual(true);
    });
  });
});
