import { User } from './user.entity';
import { Message } from './message.entity';
import { ChannelUser } from './channel-user.entity';
export declare class Channel {
    id: number;
    name: string;
    users: ChannelUser[];
    messages: Message[];
    status: 'public' | 'private' | 'protected';
    banlist: User[];
    password: string;
}
