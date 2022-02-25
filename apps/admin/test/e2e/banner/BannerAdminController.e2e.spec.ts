import { AuthService } from '@app/auth';
import { setResponse } from '@app/config/setNestApp';
import { getAdminAccessToken } from '@app/util/testing';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as path from 'path';
import { AdminModule } from '../../../../../apps/admin/src/AdminModule';
import { Repository } from 'typeorm';
import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocalDate } from '@js-joda/core';

describe('BannerAdminController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let bannerRepository: Repository<Banner>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    app = module.createNestApplication();
    setResponse(app);

    await app.init();

    accessToken = await getAdminAccessToken(module.get(AuthService));
    bannerRepository = module.get<Repository<Banner>>(
      getRepositoryToken(Banner),
    );
  });

  async function saveBanner(): Promise<Banner> {
    return await bannerRepository.save(
      Banner.create(
        '제목',
        '이미지',
        LocalDate.parse('2020-01-01'),
        LocalDate.parse('2020-01-02'),
      ),
    );
  }

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

  describe('/banner/:bannerId (PATCH)', () => {
    it('수정할 배너가 없으면 404를 응답한다', async () => {
      const res = await request(app.getHttpServer())
        .patch('/banner/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageFile', path.resolve(__dirname, './sample.jpeg'))
        .field('title', '배너 제목')
        .field('startDate', '2022-02-22')
        .field('endDate', '2022-02-21');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        message: '데이터를 찾을 수 없습니다 - "Banner" 조건: {"id": 1}',
      });
    });

    it('종료일이 시작일보다 앞서면 400을 응답한다', async () => {
      await saveBanner();

      const res = await request(app.getHttpServer())
        .patch('/banner/1')
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

    it('수정된 배너 반환', async () => {
      const banner = await saveBanner();

      const res = await request(app.getHttpServer())
        .patch('/banner/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('imageFile', path.resolve(__dirname, './sample.jpeg'))
        .field('title', '수정된 배너 제목')
        .field('startDate', '2023-02-22')
        .field('endDate', '2023-02-23');

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toMatchObject({
        title: '수정된 배너 제목',
        startDate: '2023-02-22',
        endDate: '2023-02-23',
      });
      expect(res.body.data.image).not.toBeUndefined();
      expect(res.body.data.image).not.toBe(banner.image);
    });
  });
});
