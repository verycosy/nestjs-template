import { AuthService } from '@app/auth';
import { setResponse } from '@app/config/setNestApp';
import { getAdminAccessToken } from '@app/util/testing';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as path from 'path';
import { AdminModule } from '../../../../../apps/admin/src/AdminModule';

describe('BannerAdminController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    app = module.createNestApplication();
    setResponse(app);

    await app.init();

    accessToken = await getAdminAccessToken(module.get(AuthService));
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/banner (POST)', () => {
    it('종료일이 시작일보다 앞서면 400을 응답한다', async () => {
      const res = await request(app.getHttpServer())
        .post('/banner')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageFile', path.resolve(__dirname, './sample.jpeg'))
        .field('title', '배너 제목')
        .field('startDate', '2022-02-22')
        .field('endDate', '2022-02-21');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: '배너 기간 오류 (시작일:2022-02-22, 종료일:2022-02-21)',
        error: 'Bad Request',
      });
    });

    it('추가된 배너 반환', async () => {
      const res = await request(app.getHttpServer())
        .post('/banner')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageFile', path.resolve(__dirname, './sample.jpeg'))
        .field('title', '배너 제목')
        .field('startDate', '2022-02-22')
        .field('endDate', '2022-02-23');

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toMatchObject({
        title: '배너 제목',
        startDate: '2022-02-22',
        endDate: '2022-02-23',
      });
      expect(res.body.data.image).not.toBeUndefined();
    });
  });
});
