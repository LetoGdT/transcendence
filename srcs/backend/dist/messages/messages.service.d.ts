import { Repository } from 'typeorm';
import { Message } from '../typeorm/message.entity';
import { User } from '../typeorm/user.entity';
import { UserSelectDto } from '../dto/messages.dto';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
export declare class MessagesService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    getMessages(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, user: User, options?: {
        as_sender?: boolean;
        as_recipient?: boolean;
    }): Promise<PageDto<Message>>;
    getChannelMessages(channel_id: number, pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, user: User, as_sender?: boolean): Promise<PageDto<Message>>;
    createMessage(sender: User, content: string): Promise<Message>;
    updateMessage(message: Message): Promise<Message>;
    updateMessageFromId(id: number, content: string): Promise<Message>;
    deleteMessage(message: Message): Promise<void>;
}
