import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './type/Role';
import { Cart } from '../cart/Cart.entity';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { Product } from '../product/Product.entity';

@Entity('user')
@Index(['role', 'email'], { unique: true })
export class User extends BaseTimeEntity {
  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

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

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: ['insert'],
  })
  cart: Cart;

  @ManyToMany(() => Product)
  @JoinTable()
  liked: Promise<Product[]>;

  async changePassword(newPassword: string): Promise<void> {
    this.password = await bcrypt.hash(newPassword, 10);
  }

  static async signUp(params: SignUpParams): Promise<User> {
    const { name, email, password, phoneNumber, role = Role.Customer } = params;

    const signUpUser = new User();
    await signUpUser.update(name, phoneNumber, password);
    signUpUser.role = role;
    signUpUser.email = email;

    Cart.create(signUpUser);

    return signUpUser;
  }

  async validatePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.password);
  }

  async update(
    name: string,
    phoneNumber: string,
    password?: string,
  ): Promise<void> {
    this.name = name;
    this.phoneNumber = phoneNumber;

    if (password !== undefined) {
      await this.changePassword(password);
    }
  }

  isAdmin(): boolean {
    return this.role === Role.Admin;
  }
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: Role;
}
