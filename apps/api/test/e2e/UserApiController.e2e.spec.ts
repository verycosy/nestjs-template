import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserApiModule } from '../../../api/src/user/UserApiModule';
import { TypeOrmTestModule } from '../../../../libs/entity/test/typeorm.test.module';
import * as request from 'supertest';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UserApiModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/hello (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/users/hello');
    expect(res.body).toEqual({ message: 'hello' });
  });
});
