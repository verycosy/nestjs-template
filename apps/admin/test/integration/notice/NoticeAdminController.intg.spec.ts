import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Role } from '@app/entity/domain/user/type/Role';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TestUserFactory } from '@app/util/testing';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NoticeAdminController,
  NoticeAdminService,
  WriteNoticeRequest,
} from '../../../../../apps/admin/src/notice';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';

describe('NoticeAdminController', () => {
  let sut: NoticeAdminController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        NoticeModule,
        UserModule,
        ProductModule,
      ],
      controllers: [NoticeAdminController],
      providers: [NoticeAdminService],
    }).compile();

    sut = module.get(NoticeAdminController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('write', () => {
    it('관리자가 아닌 회원이 작성하면 server error response 반환', async () => {
      const dto = new WriteNoticeRequest('notice title', 'blablah');
      const user = await TestUserFactory.create(module);

      const result = await sut.write(user, dto);

      expect(result.message).toBe('user#1 tried write notice');
      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);
    });

    it('작성된 공지사항 반환', async () => {
      const dto = new WriteNoticeRequest('notice title', 'blablah');
      const admin = await TestUserFactory.create(module, {
        role: Role.Admin,
      });

      const result = await sut.write(admin, dto);

      const data = result.data as Notice;
      expect(data.title).toBe('notice title');
      expect(data.content).toBe('blablah');
      expect(data.hit).toBe(0);
    });
  });
});
