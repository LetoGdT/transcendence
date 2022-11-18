import { User } from './user.entity';
import { Message } from './message.entity';
declare class ChannelUser {
    user: User;
    role: 'None' | 'Admin' | 'Owner';
}
export declare class Channel {
    id: number;
    users: ChannelUser[];
    messages: Message[];
    status: 'public' | 'private' | 'protected';
    banned: User[];
    password: string;
}
export {};
