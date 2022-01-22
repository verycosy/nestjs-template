import { IsNumber } from 'class-validator';

export class UpdateCartItemQuantityRequest {
  @IsNumber()
  quantity: number;

  static create(quantity: number): UpdateCartItemQuantityRequest {
    const dto = new UpdateCartItemQuantityRequest();
    dto.quantity = quantity;

    return dto;
  }
}
