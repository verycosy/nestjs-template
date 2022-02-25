import { AuthService } from '@app/auth';
import { ResponseEntity } from '@app/config/response';
import { setResponse } from '@app/config/setNestApp';
import { Category, SubCategory } from '@app/entity/domain/category';
import { getAdminAccessToken } from '@app/util/testing/getAdminAccessToken';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AdminModule } from '../../../../admin/src/AdminModule';

describe('CategoryAdminController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    app = module.createNestApplication();
    setResponse(app);

    await app.init();

    categoryRepository = module.get('CategoryRepository');
    accessToken = await getAdminAccessToken(module.get(AuthService));
  });

  afterEach(async () => {
    await app.close();
  });

  it('/category (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'fruit',
      });

    const body: ResponseEntity<Category> = res.body;
    expect(res.status).toBe(201);
    expect(body.data.id).toBe(1);
    expect(body.data.name).toBe('fruit');
  });

  describe('/category/:id (POST)', () => {
    it('상위 카테고리가 없으면 404', async () => {
      const res = await request(app.getHttpServer())
        .post('/category/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'tropics',
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: '데이터를 찾을 수 없습니다 - "Category" 조건: {"id": 1}',
      });
    });

    it('생성된 하위 카테고리 반환', async () => {
      await categoryRepository.save(new Category('fruit'));

      const res = await request(app.getHttpServer())
        .post('/category/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'tropics',
        });

      const body: ResponseEntity<SubCategory> = res.body;
      expect(res.status).toBe(201);
      expect(body.data.id).toBe(1);
      expect(body.data.name).toBe('tropics');
    });
  });
});
