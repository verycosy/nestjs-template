import { GetProductsRequest } from 'apps/api/src/product/dto/GetProductsRequest';
import {
  AbstractRepository,
  createQueryBuilder,
  EntityRepository,
} from 'typeorm';
import { Product } from './Product.entity';

@EntityRepository(Product)
export class ProductQueryRepository extends AbstractRepository<Product> {
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
}
