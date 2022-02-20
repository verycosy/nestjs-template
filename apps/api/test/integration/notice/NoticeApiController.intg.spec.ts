import { getConfigModule } from '@app/config';
import { Role } from '@app/entity/domain/user/type/Role';
import { TestNoticeFactory, TestUserFactory } from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { GetNoticesRequest } from '@app/entity/domain/notice/dto';
import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { NoticeApiController } from '../../../../../apps/api/src/notice';

describe('NoticeApiController', () => {
  let sut: NoticeApiController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigModule(), NoticeModule],
      controllers: [NoticeApiController],
    }).compile();

    sut = module.get(NoticeApiController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('getNotices', async () => {
    const dto = GetNoticesRequest.create(1, 10);

    const admin = await TestUserFactory.create(module, { role: Role.Admin });
    await TestNoticeFactory.create(module, admin);
    await TestNoticeFactory.create(module, admin);
    await TestNoticeFactory.create(module, admin);

    const result = await sut.getNotices(dto);

    expect(result.totalCount).toBe(3);
    expect(result.items.length).toBe(3);
    expect(result.items[0].id).toBe(3);
    expect(result.items[0].title).toBe('notice title');
    expect(result.items[0].createdAt).toBeDefined();
  });
});
