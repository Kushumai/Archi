import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { UserToRoles } from './user-to-roles.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @OneToMany(() => UserToRoles, (userToRoles) => userToRoles.user)
  userToRoles!: UserToRoles[];

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  test?: number;
  @Column({ nullable: true })
  testtest?: number;
  @Column({ nullable: true })
  testtesttest?: number;
  @Column({ nullable: true })
  testtesttesttest?: number;
}
