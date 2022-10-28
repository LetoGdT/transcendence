import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getAll(): Promise<User[]>;
    getOneById(id: number): Promise<User>;
    updateOne(id: number, updated: any): Promise<void>;
    addUser(createUserDto: CreateUserDto): Promise<User>;
}
