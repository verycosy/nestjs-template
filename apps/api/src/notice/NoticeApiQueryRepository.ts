import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { AbstractRepository, EntityRepository } from 'typeorm';
import { GetNoticesRequest } from './dto';

@EntityRepository(Notice)
export class NoticeApiQueryRepository extends AbstractRepository<Notice> {
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
