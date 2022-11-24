import { User } from './user.entity';
export declare class Message {
    id: number;
    sender: User;
    recipient: User;
    content: string;
    sent_date: string;
    received_date: string;
}
