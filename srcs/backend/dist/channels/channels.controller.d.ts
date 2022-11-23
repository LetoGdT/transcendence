import { ChannelsService } from './channels.service';
import { Channel } from '../typeorm/channel.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostChannelDto } from '../dto/channels.dto';
import { PatchChannelDto } from '../dto/channels.dto';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getChannels(pageOptionsDto: PageOptionsDto, req: any): Promise<PageDto<Channel>>;
    createChannel(postChannelDto: PostChannelDto, req: any): Promise<Channel>;
    getChannelbanlist(): void;
    updateChannel(id: number, patchChannelDto: PatchChannelDto, req: any): Promise<Channel>;
    getChannelUsers(pageOptionsDto: PageOptionsDto, id: number, req: any): Promise<PageDto<import("../typeorm/channel-user.entity").ChannelUser>>;
    joinChannel(id: number, req: any): Promise<Channel>;
    changeUserPermissions(): void;
    leaveChannel(): void;
}
