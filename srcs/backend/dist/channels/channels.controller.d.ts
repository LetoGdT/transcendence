import { ChannelsService } from './channels.service';
import { Channel } from '../typeorm/channel.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostChannelDto, PatchChannelDto, PatchChannelUserDto } from '../dto/channels.dto';
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getChannels(pageOptionsDto: PageOptionsDto, req: any): Promise<PageDto<Channel>>;
    createChannel(postChannelDto: PostChannelDto, req: any): Promise<Channel>;
    updateChannel(channel_id: number, patchChannelDto: PatchChannelDto, req: any): Promise<Channel>;
    getChannelUsers(pageOptionsDto: PageOptionsDto, channel_id: number, req: any): Promise<PageDto<ChannelUser>>;
    joinChannel(channel_id: number, body: {
        password: string;
    }, req: any): Promise<Channel>;
    changeUserPermissions(channel_id: number, user_id: number, patchChannelUserDto: PatchChannelUserDto, req: any): Promise<Channel>;
    leaveChannel(channel_id: number, user_id: number, req: any): Promise<Channel>;
    getChannelMessages(pageOptionsDto: PageOptionsDto, messageQueryFilterDto: MessageQueryFilterDto, userSelectDto: UserSelectDto, req: any): Promise<PageDto<Channel>>;
    getChannelMessagesAsSender(): void;
    getChannelMessagesAsRecipient(): void;
    createChannelMessage(): void;
    updateChannelMessage(): void;
    deleteChannelMessage(): void;
    getConversations(): void;
    getChannelbanlist(): void;
}
