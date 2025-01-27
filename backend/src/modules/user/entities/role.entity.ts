import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserToRoles } from './user-to-roles.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => UserToRoles, (userToRoles) => userToRoles.role)
  userToRoles!: UserToRoles[];
}