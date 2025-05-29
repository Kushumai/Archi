// user-service/src/users/dto/user.dto.ts
import { User } from '../entities/user.entity';

export class UserDto {
  id: string;
  email: string;
  username: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
  }
}