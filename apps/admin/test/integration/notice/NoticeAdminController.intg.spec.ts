import { getConfigModule } from '@app/config';
import { ResponseStatus } from '@app/config/response';
import { Notice } from '@app/entity/domain/notice/Notice.entity';
import { NoticeModule } from '@app/entity/domain/notice/NoticeModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Role } from '@app/entity/domain/user/type/Role';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { TestNoticeFactory, TestUserFactory } from '@app/util/testing';
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

      expect(result.message).toBe('user#1 tried update notice');
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

  describe('edit', () => {
    it('수정할 공지사항이 없으면 not found error response 반환', async () => {
      const dto = new WriteNoticeRequest('edited notice title', 'blablah2');
      const user = await TestUserFactory.create(module);

      const result = await sut.edit(1, user, dto);

      expect(result.message).toBe('Notice not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('관리자가 아닌 회원이 수정하면 server error response 반환', async () => {
      const dto = new WriteNoticeRequest('edited notice title', 'blablah2');
      const user = await TestUserFactory.create(module);
      const admin = await TestUserFactory.create(module, {
        role: Role.Admin,
      });
      await TestNoticeFactory.create(module, admin);

      const result = await sut.edit(1, user, dto);

      expect(result.message).toBe('user#1 tried update notice');
      expect(result.statusCode).toBe(ResponseStatus.SERVER_ERROR);
    });

    it('수정된 공지사항 반환', async () => {
      const dto = new WriteNoticeRequest('edited notice title', 'blablah2');
      const admin = await TestUserFactory.create(module, {
        role: Role.Admin,
      });
      await TestNoticeFactory.create(module, admin);

      const result = await sut.edit(1, admin, dto);

      const data = result.data as Notice;
      expect(data.title).toBe('edited notice title');
      expect(data.content).toBe('blablah2');
      expect(data.hit).toBe(0);
    });
  });

  describe('remove', () => {
    it('삭제할 공지사항이 없으면 not found error response 반환', async () => {
      const admin = await TestUserFactory.create(module, {
        role: Role.Admin,
      });

      const result = await sut.remove(1, admin);

      expect(result.message).toBe('Notice not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('삭제되면 ok response 반환', async () => {
      const admin = await TestUserFactory.create(module, {
        role: Role.Admin,
      });
      await TestNoticeFactory.create(module, admin);

      const result = await sut.remove(1, admin);

      expect(result.data).toBe('');
      expect(result.statusCode).toBe(ResponseStatus.OK);
    });
  });
});
