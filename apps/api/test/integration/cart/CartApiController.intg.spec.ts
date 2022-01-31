import { getConfigModule } from '@app/config';
import { CartModule } from '@app/entity/domain/cart/CartModule';
import { UserModule } from '@app/entity/domain/user/UserModule';
import { ProductModule } from '@app/entity/domain/product/ProductModule';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CartApiService,
  CartApiController,
  AddCartItemRequest,
  UpdateCartItemQuantityRequest,
  CartItemDto,
} from '../../../../api/src/cart';
import { getTypeOrmTestModule } from '../../../../../libs/entity/test/typeorm.test.module';
import { Product } from '@app/entity/domain/product/Product.entity';
import { User } from '@app/entity/domain/user/User.entity';
import { ResponseStatus } from '@app/config/response';
import { CategoryModule } from '@app/entity/domain/category';
import { ProductStatus } from '@app/entity/domain/product/type/ProductStatus';
import {
  TestCartItemFactory,
  TestProductFactory,
  TestProductOptionFactory,
  TestSubCategoryFactory,
  TestUserFactory,
} from '@app/util/testing';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';

describe('CartApiController', () => {
  let sut: CartApiController;
  let module: TestingModule;
  let user: User, product: Product, productOption: ProductOption;

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

    user = await TestUserFactory.create(module);

    const subCategory = await TestSubCategoryFactory.create(module);
    product = await TestProductFactory.create(module, subCategory);
    productOption = await TestProductOptionFactory.create(module, product);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('addCartItem', () => {
    it('담을 상품이 없으면 not found error response 반환', async () => {
      const dto = AddCartItemRequest.create(2, 1, 3);
      const result = await sut.addCartItem(user, dto);

      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
      expect(result.message).toBe('Product not found');
    });

    it('담긴 장바구니 상품과 수량을 반환', async () => {
      const dto = AddCartItemRequest.create(1, 1, 3);
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
        option: {
          id: 1,
          detail: 'awesome product',
          price: 3000,
        },
        quantity: 3,
      });
    });
  });

  describe('updateCartItemQuantity', () => {
    const dto = UpdateCartItemQuantityRequest.create(1);

    it('수량을 변경할 장바구니 상품이 없으면 not found error response 반환', async () => {
      const result = await sut.updateCartItemQuantity(user, 1, dto);

      expect(result.message).toBe('Cart item not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('다른 사람의 장바구니 상품이면 not found error response 반환', async () => {
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
      );
      user.id = 2;

      const result = await sut.updateCartItemQuantity(user, 1, dto);

      expect(result.message).toBe('Cart item not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('수량이 변경된 장바구니 상품 반환', async () => {
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
      );

      const result = await sut.updateCartItemQuantity(user, 1, dto);

      const data = result.data as CartItemDto;
      expect(data.quantity).toBe(1);
    });
  });

  describe('removeCartItem', () => {
    it('삭제할 장바구니 상품이 없으면 not found error response 반환', async () => {
      const result = await sut.removeCartItem(user, 1);

      expect(result.message).toBe('Cart item not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('다른 사람의 장바구니 상품이면 not found error response 반환', async () => {
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
      );
      user.id = 2;

      const result = await sut.removeCartItem(user, 1);

      expect(result.message).toBe('Cart item not found');
      expect(result.statusCode).toBe(ResponseStatus.NOT_FOUND);
    });

    it('삭제되면 ok response 반환', async () => {
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
      );

      const result = await sut.removeCartItem(user, 1);

      expect(result.message).toBe('');
    });
  });

  describe('getCartItems', () => {
    it('장바구니 상품 목록 최신순으로 반환', async () => {
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
      );
      await TestCartItemFactory.create(
        module,
        user.cart,
        product,
        productOption,
        3,
      );

      const result = await sut.getCartItems(user);

      const data = result.data as CartItemDto[];
      expect(data.length).toBe(2);
      expect(data[0]).toEqual({
        id: 2,
        product: {
          id: 1,
          name: 'banana',
          price: 1000,
          status: ProductStatus.SELL,
        },
        option: {
          id: 1,
          detail: 'awesome product',
          price: 3000,
        },
        quantity: 3,
      });
    });
  });
});
