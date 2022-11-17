import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
export declare class PrivatesService {
    private readonly privatesRepository;
    private readonly usersService;
    private readonly messagesService;
    IdMax: number;
    constructor(privatesRepository: Repository<PrivateMessage>, usersService: UsersService, messagesService: MessagesService);
    getMessages(pageOptionsDto: PageOptionsDto): Promise<PageDto<PrivateMessage>>;
    createMessage(postPrivateDto: PostPrivateDto, sender: User): Promise<PrivateMessage>;
    updateMessage(id: number, updateMessageDto: UpdateMessageDto): Promise<import("typeorm").UpdateResult>;
    deleteMessage(id: number, user: User): Promise<PrivateMessage>;
}
