import { UsersService } from './users.service';
import { ReturnUserDto } from '../dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<ReturnUserDto[]>;
    getUserById(id: number): Promise<ReturnUserDto>;
}
