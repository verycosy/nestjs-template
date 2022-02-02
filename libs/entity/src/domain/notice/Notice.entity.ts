import { CommandForbiddenError } from '@app/auth/error';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/User.entity';

@Entity('notice')
export class Notice extends BaseTimeEntity {
  constructor(writer: User, title: string, content: string) {
    super();

    if (!writer.isAdmin()) {
      throw new CommandForbiddenError(`Can not write notice`);
    }

    this.writer = writer;
    this.title = title;
    this.content = content;
  }

  @ManyToOne(() => User)
  writer: User;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column()
  hit: number;
}
