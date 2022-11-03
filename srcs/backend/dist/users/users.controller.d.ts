import { UsersService } from './users.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { UpdateUserDto } from '../dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>;
    currentUser(req: any): any;
    updateUser(updateUserDto: UpdateUserDto, req: any): Promise<import("typeorm").UpdateResult>;
    getUserById(id: number): Promise<User>;
}
