import { MessagesService } from './messages.service';
import { PageDto } from '../dto/page.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { Message } from '../typeorm/message.entity';
import { UsersService } from '../users/users.service';
export declare class MessagesController {
    private readonly messagesService;
    private readonly usersService;
    constructor(messagesService: MessagesService, usersService: UsersService);
    getMessages(pageOptionsDto: PageOptionsDto, req: any, q: any): Promise<PageDto<Message>>;
    getMessagesAsSender(pageOptionsDto: PageOptionsDto, req: any): Promise<PageDto<Message>>;
    getMessagesAsRecipient(pageOptionsDto: PageOptionsDto, req: any): Promise<PageDto<Message>>;
    createMessage(body: {
        recipient: string;
        content: string;
    }, req: any): Promise<Message>;
}
