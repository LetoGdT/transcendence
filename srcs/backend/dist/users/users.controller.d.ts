import { UsersService } from './users.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<User[]>;
    getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>;
    getUserById(id: string): Promise<User>;
}
