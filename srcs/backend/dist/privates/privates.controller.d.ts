import { MessagesService } from '../messages/messages.service';
export declare class PrivatesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getPrivateMessages(): any;
}
