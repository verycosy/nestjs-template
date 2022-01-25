import { Cart } from '@app/entity/domain/cart/Cart.entity';
import { CartItem } from '@app/entity/domain/cart/CartItem.entity';
import { User } from '@app/entity/domain/user/User.entity';

describe('Cart', () => {
  describe('isBelongsTo', () => {
    it('내 장바구니가 아니면 false 반환', async () => {
      const result = createCart().isBelongsTo(2);

      expect(result).toEqual(false);
    });

    it('내 장바구니이면 true 반환', async () => {
      const result = createCart().isBelongsTo(1);

      expect(result).toEqual(true);
    });
  });

  describe('hasCartItems', () => {
    it('내 장바구니에 담긴 목록이 아니면 false 반환', () => {
      const result = createCartWithItem().hasCartItems([1, 3]);

      expect(result).toBe(false);
    });

    it('내 장바구니에 담긴 목록이면 true 반환', () => {
      const result = createCartWithItem().hasCartItems([1, 2]);

      expect(result).toBe(true);
    });
  });
});

function createCart(): Cart {
  const cart = new Cart();
  cart.user = new User();
  cart.user.id = 1;

  return cart;
}

function createCartItem(cartItemId: number): CartItem {
  const cartItem = new CartItem();
  cartItem.id = cartItemId;

  return cartItem;
}

function createCartWithItem(): Cart {
  const cart = new Cart();
  cart.items = [createCartItem(1), createCartItem(2)];

  return cart;
}
