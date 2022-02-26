import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { DateTimeUtil } from '@app/util/DateTimeUtil';
import { LocalDate } from '@js-joda/core';
import { AbstractRepository, EntityRepository } from 'typeorm';

@EntityRepository(Banner)
export class BannerApiQueryRepository extends AbstractRepository<Banner> {
  findInProgressBanners(now: LocalDate): Promise<Banner[]> {
    return this.createQueryBuilder('banner')
      .where('start_date <= :now AND end_date >= :now', {
        now: DateTimeUtil.toDate(now),
      })
      .orderBy({
        id: 'DESC',
      })
      .getMany();
  }
}
