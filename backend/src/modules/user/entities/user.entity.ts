import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles!: Role[];
}
