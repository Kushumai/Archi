import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    validate(loginDto: LoginDto): Promise<{
        isValid: boolean;
        userId: null;
    } | {
        isValid: boolean;
        userId: number;
    }>;
}
