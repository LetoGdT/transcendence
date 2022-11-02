import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>;
    getOneById(id: number): Promise<User>;
    getOneByRefresh(refresh: string): Promise<User>;
    updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult>;
    addUser(createUserDto: CreateUserDto): Promise<User>;
}
