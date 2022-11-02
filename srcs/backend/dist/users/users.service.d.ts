import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getAll(): Promise<User[]>;
    getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>;
    getOneById(id: string): Promise<User>;
    getOneByRefresh(refresh: string): Promise<User>;
    updateOne(id: number, updated: any): Promise<void>;
    addUser(createUserDto: CreateUserDto): Promise<User>;
}
