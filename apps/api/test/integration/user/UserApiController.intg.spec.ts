import { Test, TestingModule } from '@nestjs/testing';
import { UserApiService } from '../../../src/user/UserApiService';
import { UserApiController } from '../../../src/user/UserApiController';

describe('UserApiController', () => {
  let sut: UserApiController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UserApiService],
      controllers: [UserApiController],
    }).compile();

    sut = module.get(UserApiController);
  });

  it('sayHello', () => {
    expect(sut.sayHello()).toEqual({ message: 'hello' });
  });
});
