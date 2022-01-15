import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubCategory } from './SubCategory.entity';

@Entity('category')
export class Category {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    eager: true,
    cascade: ['insert'],
  })
  subCategories: SubCategory[];

  addSubCategory(subCategoryName: string): SubCategory {
    const subCategory = new SubCategory(subCategoryName);

    if (!Array.isArray(this.subCategories)) {
      this.subCategories = [];
    }

    this.subCategories.push(subCategory);

    return subCategory;
  }
}
