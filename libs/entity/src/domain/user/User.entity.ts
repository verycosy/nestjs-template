import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  static signUp(email: string, password: string): User {
    const signUpUser = new User();

    signUpUser.email = email;
    signUpUser.password = password;

    return signUpUser;
  }
}
