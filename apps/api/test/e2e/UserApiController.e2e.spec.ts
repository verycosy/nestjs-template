import { CACHE_MANAGER, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserApiModule } from '../../../api/src/user/UserApiModule';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import * as request from 'supertest';
import { getApiModuleProvider } from '../../src/getApiModuleProvider';
import { SMS_SERVICE } from '@app/util/sms/SmsService';
import { MockSmsService } from '@app/util/sms/MockSmsService';
import { Cache } from 'cache-manager';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;
  let cacheManager: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserApiModule],
      providers: [...getApiModuleProvider()],
    })
      .overrideProvider(SMS_SERVICE)
      .useClass(MockSmsService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await app.close();
    await cacheManager.reset();
  });

  describe('/sign-up (POST)', () => {
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
      const phoneNumber = '010-1111-2222';
      await authSms(phoneNumber);

      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          name: 'verycosy',
          email: 'test@test.com',
          password: 'password',
          phoneNumber,
          confirmPassword: 'password',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toEqual('test@test.com');
      expect(res.body.phoneNumber).toEqual('010-1111-2222');
    });
  });
});
