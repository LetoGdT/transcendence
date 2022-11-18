import { User } from './user.entity';
import { Channel } from './channel.entity';
export declare class Message {
    id: number;
    sender: User;
    recipient: User;
    content: string;
    sent_date: Date;
    received_date: Date;
    channel?: Channel;
}
