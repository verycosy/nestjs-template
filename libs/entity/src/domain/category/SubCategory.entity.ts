import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';

@Entity('sub_category')
export class SubCategory {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;
}
