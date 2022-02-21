import { OrderReadyRequest } from '../order/dto';
import { GetProductsRequest } from './dto';
import {
  AbstractRepository,
  createQueryBuilder,
  EntityRepository,
} from 'typeorm';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductOption } from '@app/entity/domain/product/ProductOption.entity';

@EntityRepository(Product)
export class ProductApiQueryRepository extends AbstractRepository<Product> {
  async paging(param: GetProductsRequest): Promise<[Product[], number]> {
    const queryBuilder = createQueryBuilder()
      .select(['product.id', 'product.name', 'product.price', 'product.status'])
      .orderBy({
        id: 'DESC',
      })
      .from(Product, 'product')
      .limit(param.getLimit())
      .offset(param.getOffset());

    if (param.hasSubCategoryId()) {
      queryBuilder.andWhere('product.sub_category_id = :subCategoryId', {
        subCategoryId: param.subCategoryId,
      });
    }

    return queryBuilder.disableEscaping().getManyAndCount();
  }

  async findByIdOrFail(id: number): Promise<Product> {
    return await this.repository.findOneOrFail({ id });
  }

  async findProductAndOptionForOrderReady(
    param: OrderReadyRequest,
  ): Promise<[Product, ProductOption]> {
    const { productId, productOptionId } = param;

    const product = await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.options', 'options')
      .where({ id: productId })
      .andWhere('options.id = :optionId', { optionId: productOptionId })
      .getOneOrFail();

    return [product, product.options[0]];
  }
}
