import { User } from '@app/entity/domain/user/User.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiModule } from '../../../api/src/api.module';
import { Repository } from 'typeorm';
import * as request from 'supertest';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    userRepository = module.get('UserRepository');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/me (PATCH)', () => {
    it('회원 이름을 변경하고 변경된 이름을 반환', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const user = await User.signUp({
        name: 'tester',
        phoneNumber: '010-1111-222',
        email,
        password,
      });
      await userRepository.save(user);

      const {
        body: { accessToken },
      } = await request(app.getHttpServer()).post('/users/login').send({
        email,
        password,
      });

      const { body, statusCode } = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'this is new name' });

      expect(statusCode).toEqual(200);
      expect(body.name).toEqual('this is new name');
    });
  });
});
