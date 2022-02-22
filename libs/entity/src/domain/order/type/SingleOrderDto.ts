export class SingleOrderDto {
  constructor(
    readonly productId: number,
    readonly productOptionId: number,
    readonly quantity: number,
  ) {}
}
