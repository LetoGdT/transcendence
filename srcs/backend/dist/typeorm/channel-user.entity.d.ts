import { User } from './user.entity';
import { Channel } from './channel.entity';
export declare class ChannelUser {
    id: number;
    user: User;
    role: 'None' | 'Admin' | 'Owner';
    channel: Channel;
}
