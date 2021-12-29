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
    it('', async () => {});
  });
});
