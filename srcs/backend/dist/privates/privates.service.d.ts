import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { UserSelectDto } from '../dto/messages.dto';
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
export declare class PrivatesService {
    private readonly privatesRepository;
    private readonly usersService;
    private readonly messagesService;
    IdMax: number;
    constructor(privatesRepository: Repository<PrivateMessage>, usersService: UsersService, messagesService: MessagesService);
    getMessages(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, user: User, options?: {
        as_sender?: boolean;
        as_recipient?: boolean;
    }): Promise<PageDto<PrivateMessage>>;
    createMessage(postPrivateDto: PostPrivateDto, sender: User): Promise<PrivateMessage>;
    updateMessage(id: number, updateMessageDto: UpdateMessageDto, user: User): Promise<PrivateMessage>;
    deleteMessage(id: number, user: User): Promise<PrivateMessage>;
}
