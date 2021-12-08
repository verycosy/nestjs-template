import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserApiModule } from '../../../api/src/user/UserApiModule';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import * as request from 'supertest';
import { getApiModuleProvider } from '../../src/getApiModuleProvider';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserApiModule],
      providers: [...getApiModuleProvider()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hello (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/users/hello');
    expect(res.body).toEqual({ message: 'hello' });
  });

  describe('/sign-up (POST)', () => {
    it('비밀번호가 서로 다르면 에러 메시지', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password',
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
      const res = await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toEqual('test@test.com');
    });
  });
});
