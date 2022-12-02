import { Message } from './message.entity';
import { ChannelUser } from './channel-user.entity';
import { ChannelBan } from '../typeorm/channel-ban.entity';
export declare class Channel {
    id: number;
    name: string;
    users: ChannelUser[];
    messages: Message[];
    status: 'public' | 'private' | 'protected';
    latest_sent: Date;
    banlist: ChannelBan[];
    password: string;
}
