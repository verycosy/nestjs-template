import { GetNoticesRequest } from 'apps/api/src/notice';
import { AbstractRepository, EntityRepository } from 'typeorm';
import { Notice } from './Notice.entity';

@EntityRepository(Notice)
export class NoticeQueryRepository extends AbstractRepository<Notice> {
  paging(param: GetNoticesRequest): Promise<[Notice[], number]> {
    const queryBuilder = this.createQueryBuilder('notice')
      .orderBy({
        id: 'DESC',
      })
      .offset(param.getOffset())
      .limit(param.getLimit());

    return queryBuilder.disableEscaping().getManyAndCount();
  }
}
