import { User } from './user.entity';
import { Channel } from './channel.entity';
export declare class ChannelBan {
    id: number;
    user: User;
    unban_date: Date;
    channel: Channel;
}
