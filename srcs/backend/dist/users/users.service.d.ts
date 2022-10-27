import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getAll(): Promise<User[]>;
    addUser(createUserDto: CreateUserDto): Promise<User>;
}
