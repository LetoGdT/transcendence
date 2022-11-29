import { Repository } from 'typeorm';
import { Channel } from '../typeorm/channel.entity';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PostChannelDto } from '../dto/channels.dto';
import { PatchChannelDto } from '../dto/channels.dto';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
export declare class ChannelsService {
    private readonly channelRepository;
    private readonly channelUserRepository;
    IdMax: number;
    permissions: Map<string, number>;
    constructor(channelRepository: Repository<Channel>, channelUserRepository: Repository<ChannelUser>);
    getChannels(pageOptionsDto: PageOptionsDto, user: User): Promise<PageDto<Channel>>;
    getChannelUsers(pageOptionsDto: PageOptionsDto, id: number, user: User): Promise<PageDto<ChannelUser>>;
    createChannel(postChannelDto: PostChannelDto, requester: User): Promise<Channel>;
    updateChannel(id: number, patchChannelDto: PatchChannelDto, user: User): Promise<Channel>;
    joinChannel(id: number, requester: User, password: string): Promise<Channel>;
    updateChannelUser(channel_id: number, user_id: number, user: User, role: 'None' | 'Admin' | 'Owner'): Promise<Channel>;
    findToPromote(users: ChannelUser[]): number;
    deleteChannelUser(channel_id: number, user_id: number, user: User): Promise<Channel>;
    getChannelMessages(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, user: User, options?: {
        as_sender?: boolean;
        as_recipient?: boolean;
    }): Promise<PageDto<Channel>>;
}
