import { Repository } from 'typeorm';
import { Message } from '../typeorm/message.entity';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class MessagesService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    getMessages(pageOptionsDto: PageOptionsDto): Promise<PageDto<Message>>;
    createMessage(sender: User, recipient: User, content: string): Promise<Message>;
}
