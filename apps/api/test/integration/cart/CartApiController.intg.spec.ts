import { getConfigModule } from '@app/config';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CartApiService,
  CartApiController,
  AddCartItemRequest,
  CartItemDto,
} from '../../../../api/src/cart';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { Repository } from 'typeorm';
import { Product } from '@app/entity/domain/product/Product.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { ResponseStatus } from '@app/config/response';
import { Category, CategoryModule } from '@app/entity/domain/category';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';

describe('CartApiController', () => {
  let sut: CartApiController;
  let module: TestingModule;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;
  let user: User;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        getConfigModule(),
        getTypeOrmTestModule(),
        UserModule,
        CartModule,
        CategoryModule,
        ProductModule,
      ],
      controllers: [CartApiController],
      providers: [CartApiService],
    }).compile();

    sut = module.get(CartApiController);
    userRepository = module.get('UserRepository');
    productRepository = module.get('ProductRepository');
    categoryRepository = module.get('CategoryRepository');

    user = await User.signUp({
      name: 'tester',
      email: 'test@test.com',
      password: 'password',
      phoneNumber: '010-1111-2222',
    });
    await userRepository.save(user);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('addCartItem', () => {
    const dto = AddCartItemRequest.create(1, 3);

    it('담을 상품이 없으면 not found error response 반환', async () => {
      const result = await sut.addCartItem(user, dto);

      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
      expect(result.message).toBe('Product not found');
    });

    it('담긴 상품과 수량을 반환', async () => {
      const category = new Category('fruit');
      const subCategory = category.addSubCategory('tropics');
      await categoryRepository.save(category);
      await productRepository.save(
        Product.create(subCategory, 'banana', 1000, 'yummy'),
      );

      const result = await sut.addCartItem(user, dto);

      const data = result.data as CartItemDto;
      expect(data).toEqual({
        id: 1,
        product: {
          id: 1,
          name: 'banana',
          price: 1000,
          status: ProductStatus.SELL,
        },
        quantity: 3,
      });
    });
  });
});
