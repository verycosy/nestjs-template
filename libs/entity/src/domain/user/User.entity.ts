import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async signUp(params: Partial<User>): Promise<User> {
    const { name, email, password } = params;
    const signUpUser = new User();

    signUpUser.name = name;
    signUpUser.email = email;
    signUpUser.password = await User.hashPassword(password);

    return signUpUser;
  }
}
