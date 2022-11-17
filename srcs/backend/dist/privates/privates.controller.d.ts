import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
export declare class PrivatesController {
    private readonly privatesService;
    private readonly messagesService;
    constructor(privatesService: PrivatesService, messagesService: MessagesService);
    getPrivateMessages(pageOptionsDto: PageOptionsDto, req: any): Promise<PageDto<PrivateMessage>>;
    createPrivateMessage(postPrivateDto: PostPrivateDto, req: any): Promise<PrivateMessage>;
    createPrivateMessageFromRecipientName(recipient: string, body: {
        content: string;
    }, req: any): Promise<PrivateMessage>;
    updatePrivateMessage(id: number, updateMessageDto: UpdateMessageDto, req: any): Promise<import("typeorm").UpdateResult>;
    deletePrivateMessage(id: number, req: any): Promise<PrivateMessage>;
}
