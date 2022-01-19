import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './type/Role';

@Entity('user')
@Index(['role', 'email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @Column()
  private name: string;

  @Column()
  email: string;

  @Column()
  private password: string;

  @Column({
    length: 13,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({ nullable: true })
  profileImageUrl: string | null;

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  async changePassword(newPassword: string): Promise<void> {
    this.password = await bcrypt.hash(newPassword, 10);
  }

  static async signUp(params: SignUpParams): Promise<User> {
    const { name, email, password, phoneNumber, role = Role.Customer } = params;
    const signUpUser = new User();

    signUpUser.role = role;
    signUpUser.setName(name);
    signUpUser.email = email;
    await signUpUser.changePassword(password);
    signUpUser.phoneNumber = phoneNumber;

    return signUpUser;
  }

  async validatePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.password);
  }
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: Role;
}
