import { Repository } from 'typeorm';
import { Message } from '../typeorm/message.entity';
export declare class MessagesService {
    private readonly userRepository;
    constructor(userRepository: Repository<Message>);
}
