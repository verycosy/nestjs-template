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

    notice.writer = writer;
    notice.update(writer, title, content);

    return notice;
  }

  update(writer: User, title: string, content: string): void {
    if (!writer.isAdmin()) {
      throw new CommandForbiddenError(writer, 'update notice');
    }

    this.title = title;
    this.content = content;
  }
}
