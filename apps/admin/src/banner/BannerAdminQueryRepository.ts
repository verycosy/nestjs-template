import { Banner } from '@app/entity/domain/banner/Banner.entity';
import { AbstractRepository, EntityRepository } from 'typeorm';
import { GetBannersRequest } from './dto';

@EntityRepository(Banner)
export class BannerAdminQueryRepository extends AbstractRepository<Banner> {
  paging(param: GetBannersRequest): Promise<[Banner[], number]> {
    const queryBuilder = this.createQueryBuilder('banner')
      .orderBy({
        id: 'DESC',
      })
      .limit(param.getLimit())
      .offset(param.getOffset());

    return queryBuilder.disableEscaping().getManyAndCount();
  }
}
