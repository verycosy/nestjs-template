import { getConfigModule } from '@app/config';
import { Test } from '@nestjs/testing';
import { CategoryAdminController } from '../../../src/category/controller/CategoryAdminController';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { CategoryModule } from '@app/entity/domain/category/CategoryModule';
import { CreateCategoryRequest } from '../../../src/category/dto';

describe('CategoryAdminController', () => {
  let sut: CategoryAdminController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [getConfigModule(), getTypeOrmTestModule(), CategoryModule],
      controllers: [CategoryAdminController],
    }).compile();

    sut = module.get(CategoryAdminController);
  });

  it('createCategory', async () => {
    const request = new CreateCategoryRequest();
    request.name = 'fruit';

    const result = await sut.createCategory(request);

    expect(result.data.name).toEqual('fruit');
  });
});
