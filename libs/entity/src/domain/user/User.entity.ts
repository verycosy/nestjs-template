import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async signUp(email: string, password: string): Promise<User> {
    const signUpUser = new User();

    signUpUser.email = email;
    signUpUser.password = await User.hashPassword(password);

    return signUpUser;
  }
}
