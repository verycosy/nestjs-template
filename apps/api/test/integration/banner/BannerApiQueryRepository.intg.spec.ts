import { getConfigModule } from '@app/config';
import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { TypeOrmTestModule } from '@app/entity/typeorm.test.module';
import { LocalDate } from '@js-joda/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerApiQueryRepository } from '../../../../../apps/api/src/banner/BannerApiQueryRepository';

describe('BannerApiQueryRepository', () => {
  let sut: BannerApiQueryRepository;
  let module: TestingModule;
  let bannerRepository: Repository<Banner>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        TypeOrmTestModule,
        TypeOrmModule.forFeature([BannerApiQueryRepository]),
      ],
    }).compile();

    sut = module.get(BannerApiQueryRepository);
    bannerRepository = module.get(getRepositoryToken(Banner));
  });

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

  afterAll(async () => {
    await module.close();
  });

  describe('findInProgressBanners', () => {
    it('오늘 날짜를 기준으로 진행중인 배너 목록을 반환한다', async () => {
      // given
      const now = LocalDate.parse('2022-02-22');
      await Promise.all([
        saveBanner('2022-01-01', '2022-02-21'),
        saveBanner('2022-01-01', '2022-04-01'), // 진행중
        saveBanner('2022-02-21', '2022-02-22'), // 진행중
        saveBanner('2022-02-22', '2022-02-22'), // 진행중
        saveBanner('2022-02-22', '2022-02-23'), // 진행중
        saveBanner('2022-02-23', '2022-02-25'),
      ]);

      // when
      const result = await sut.findInProgressBanners(now);

      // then
      expect(result.length).toBe(4);
      result.map((banner) => {
        const { startDate, endDate } = banner;
        expect(startDate.isBefore(now) || startDate.isEqual(now)).toBe(true);
        expect(endDate.isAfter(now) || endDate.isEqual(now)).toBe(true);
      });
    });
  });
});
