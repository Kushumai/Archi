import { Role } from './role.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    roles: Role[];
}
