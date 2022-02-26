import { setNestApp } from '@app/config/setNestApp';
import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { LocalDate } from '@js-joda/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { ApiModule } from '../../../../../apps/api/src/api.module';

describe('BannerApiController (e2e)', () => {
  let app: INestApplication;
  let bannerRepository: Repository<Banner>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = module.createNestApplication();
    setNestApp(app);
    await app.init();

    bannerRepository = module.get(getRepositoryToken(Banner));

    async function saveBanner(
      startDateString: string,
      endDateString: string,
    ): Promise<Banner> {
      return await bannerRepository.save(
        Banner.create(
          '제목',
          '이미지',
          LocalDate.parse(startDateString),
          LocalDate.parse(endDateString),
        ),
      );
    }

    await saveBanner('2022-01-01', '2022-02-21');
    await saveBanner('2022-01-01', '2022-04-01'); // 진행중
    await saveBanner('2022-02-21', '2022-02-22'); // 진행중
    await saveBanner('2022-02-22', '2022-02-22'); // 진행중
    await saveBanner('2022-02-22', '2022-02-23'); // 진행중
    await saveBanner('2022-02-23', '2022-02-25');
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('/banner (GET)', () => {
    it('진행중인 배너 목록을 최신순으로 반환한다', async () => {
      jest
        .spyOn(LocalDate, 'now')
        .mockReturnValue(LocalDate.parse('2022-02-22'));

      const res = await request(app.getHttpServer()).get('/banner');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          id: 5,
          title: '제목',
          image: '이미지',
        },
        {
          id: 4,
          title: '제목',
          image: '이미지',
        },
        {
          id: 3,
          title: '제목',
          image: '이미지',
        },
        {
          id: 2,
          title: '제목',
          image: '이미지',
        },
      ]);
    });
  });
});
