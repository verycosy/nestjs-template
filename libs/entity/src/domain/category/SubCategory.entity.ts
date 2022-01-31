import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '../product/Product.entity';
import { Category } from './Category.entity';

@Entity('sub_category')
export class SubCategory extends BaseTimeEntity {
  constructor(name: string) {
    super();

    this.name = name;
  }

  @Column()
  name: string;

  @ManyToOne(() => Category, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  static create(category: Category, name: string): SubCategory {
    const subCategory = new SubCategory(name);
    subCategory.category = category;

    return subCategory;
  }
}
