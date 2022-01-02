import { CACHE_MANAGER, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Cache } from 'cache-manager';
import { ApiModule } from '../../src/api.module';
import { AuthCodeService } from '@app/util/auth-code';
import { Repository } from 'typeorm';
import { User } from '@app/entity/domain/user/User.entity';
import { AuthService } from '@app/auth';

describe('UserAuthApiController (e2e)', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  let authCodeService: AuthCodeService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
    authCodeService = module.get(AuthCodeService);
    authService = module.get(AuthService);
    userRepository = module.get('UserRepository');
  });

  afterEach(async () => {
    await userRepository.clear();
    await app.close();
    await cacheManager.reset();
    jest.clearAllMocks();
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
      jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);

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

      jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);

      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          email,
          password,
          name: 'verycosy',
          phoneNumber,
          confirmPassword: password,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toEqual(email);
      expect(res.body.phoneNumber).toEqual(phoneNumber);
    });
  });

  describe('/login (POST)', () => {
    const email = 'test@test.com';
    const password = 'password';
    const phoneNumber = '010-1111-2222';

    beforeEach(async () => {
      await signUp(email, password, phoneNumber);
    });

    it('존재하지 않는 계정이면 error', async () => {
      const res = await request(app.getHttpServer()).post('/users/login').send({
        email: 'not-found@test.com',
        password: 'passwood',
      });

      expect(res.statusCode).toEqual(500);
    });

    it('비밀번호가 일치하지 않으면 error', async () => {
      const res = await request(app.getHttpServer()).post('/users/login').send({
        email,
        password: 'passwood',
      });

      expect(res.statusCode).toEqual(500);
    });

    it('회원 정보와 jwt 토큰 반환', async () => {
      const email = 'test@test.com';
      const password = 'password';

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email,
          password,
        });

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
    const { accessToken } = await authService.login(email, password);

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
      const { refreshToken: oldRefreshToken } = await authService.login(
        email,
        password,
      );

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

  describe('/check-email (POST)', () => {
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

  describe('/find-email (POST)', () => {
    it('가입된 이메일이 있는지 확인', async () => {
      const name = 'exists';
      const email = 'exists@test.com';
      const password = 'password';
      const phoneNumber = '010-1111-2222';

      jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);
      const { statusCode, body } = await request(app.getHttpServer())
        .post('/users/find-email')
        .send({ name, phoneNumber });

      expect(statusCode).toEqual(201);
      expect(body.email).toBeNull();

      await signUp(email, password, phoneNumber, name);

      const result = await request(app.getHttpServer())
        .post('/users/find-email')
        .send({ name, phoneNumber });

      expect(result.statusCode).toEqual(201);
      expect(result.body.email).toEqual(email);
    });
  });

  it('/find-password (POST, PATCH)', async () => {
    const email = 'findpassword@test.com';
    const password = 'password';
    const phoneNumber = '010-1111-2222';

    await signUp(email, password, phoneNumber);

    jest.spyOn(authCodeService, 'isVerified').mockResolvedValue(true);
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/users/find-password')
      .send({ email, phoneNumber });

    expect(statusCode).toEqual(201);
    expect(body.accessToken).toBeDefined();

    await request(app.getHttpServer())
      .patch('/users/find-password')
      .send({ password: 'new password', confirmPassword: 'new password' })
      .set('Authorization', `Bearer ${body.accessToken}`);

    const user = await userRepository.findOne({ email });
    expect(user.validatePassword('new password')).resolves.toEqual(true);
  });
});
