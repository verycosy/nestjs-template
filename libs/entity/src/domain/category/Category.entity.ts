import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SubCategory } from './SubCategory.entity';

@Entity('category')
export class Category extends BaseTimeEntity {
  constructor(name: string) {
    super();

    this.name = name;
  }

  @Column()
  name: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    eager: true,
  })
  subCategories: SubCategory[];
}
