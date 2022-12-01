import { Message } from './message.entity';
import { User } from './user.entity';
export declare class PrivateMessage {
    id: number;
    recipient: User;
    message: Message;
}
