import { Test, TestingModule } from '@nestjs/testing';
import { UserApiService } from '../../../src/user/UserApiService';

describe('UserApiService', () => {
  let sut: UserApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UserApiService],
    }).compile();

    sut = module.get(UserApiService);
  });

  it('sayHello', () => {
    expect(sut.sayHello()).toEqual('hello');
  });
});
