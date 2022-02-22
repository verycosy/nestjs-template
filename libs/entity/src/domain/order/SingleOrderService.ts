import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/Product.entity';
import { ProductOption } from '../product/ProductOption.entity';
import { User } from '../user/User.entity';
import { Order } from './Order.entity';
import { OrderItem } from './OrderItem.entity';
import { SingleOrderDto } from './type/SingleOrderDto';

@Injectable()
export class SingleOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private async findProductAndOptionForOrderReady(
    dto: SingleOrderDto,
  ): Promise<[Product, ProductOption]> {
    const { productId, productOptionId } = dto;

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.options', 'options')
      .where({ id: productId })
      .andWhere('options.id = :optionId', { optionId: productOptionId })
      .getOneOrFail();

    return [product, product.options[0]];
  }

  async ready(user: User, dto: SingleOrderDto): Promise<Order> {
    const [product, productOption] =
      await this.findProductAndOptionForOrderReady(dto);

    const orderItem = OrderItem.create(product, productOption, dto.quantity);
    return await this.orderRepository.save(Order.create(user, orderItem));
  }
}
