import { ChannelUser } from './channel-user.entity';
export declare class User {
    id: number;
    uid: number;
    username: string;
    email: string;
    image_url: string;
    status: 'online' | 'offline' | 'in-game';
    refresh_token: string;
    refresh_expires: string;
    channelUsers: ChannelUser;
}
