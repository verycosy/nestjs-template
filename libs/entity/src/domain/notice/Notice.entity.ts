import { CommandForbiddenError } from '@app/auth/error';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/User.entity';

@Entity('notice')
export class Notice extends BaseTimeEntity {
  @ManyToOne(() => User)
  writer: User;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    default: 0,
  })
  hit: number;

  static create(writer: User, title: string, content: string): Notice {
    const notice = new Notice();

    if (!writer.isAdmin()) {
      throw new CommandForbiddenError(writer, 'write notice');
    }

    notice.writer = writer;
    notice.title = title;
    notice.content = content;

    return notice;
  }
}
