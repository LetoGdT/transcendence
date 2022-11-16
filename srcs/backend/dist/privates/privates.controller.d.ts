import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class PrivatesController {
    private readonly privatesService;
    private readonly messagesService;
    constructor(privatesService: PrivatesService, messagesService: MessagesService);
    getPrivateMessages(pageOptionsDto: PageOptionsDto, req: any): void;
    createPrivateMessage(): any;
    updatePrivateMessage(): any;
    deletePrivateMessage(): void;
}
