import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_to_roles')
export class UserToRoles {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userToRoles, { onDelete: 'CASCADE' }) // Relie à User
  @JoinColumn({ name: 'user_id' }) // Colonne "user_id"
  user!: User;

  @ManyToOne(() => Role, (role) => role.userToRoles, { onDelete: 'CASCADE' }) // Relie à Role
  @JoinColumn({ name: 'role_id' }) // Colonne "role_id"
  role!: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}