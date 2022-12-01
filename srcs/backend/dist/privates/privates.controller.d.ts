import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
export declare class PrivatesController {
    private readonly privatesService;
    private readonly messagesService;
    constructor(privatesService: PrivatesService, messagesService: MessagesService);
    getPrivateMessages(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, req: any): Promise<PageDto<PrivateMessage>>;
    getPrivateMessagesAsSender(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, req: any): Promise<PageDto<PrivateMessage>>;
    getPrivateMessagesAsRecipient(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, req: any): Promise<PageDto<PrivateMessage>>;
    getConversations(req: any): Promise<PrivateMessage[]>;
    createPrivateMessage(postPrivateDto: PostPrivateDto, req: any): Promise<PrivateMessage>;
    createPrivateMessageFromRecipientName(recipient: string, body: {
        content: string;
    }, req: any): Promise<PrivateMessage>;
    updatePrivateMessage(id: number, updateMessageDto: UpdateMessageDto, req: any): Promise<PrivateMessage>;
    deletePrivateMessage(id: number, req: any): Promise<PrivateMessage>;
}
