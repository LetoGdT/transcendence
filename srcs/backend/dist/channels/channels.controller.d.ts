import { ChannelsService } from './channels.service';
import { PostChannelDto } from '../dto/channels.dto';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getChannels(): Promise<import("../typeorm/channel.entity").Channel[]>;
    createChannel(postChannelDto: PostChannelDto, req: any): Promise<import("../typeorm/channel.entity").Channel>;
    getChannelUsers(): void;
    getChannelbanlist(): void;
    updateChannel(): void;
    joinChannel(id: number, req: any): Promise<import("../typeorm/channel.entity").Channel>;
    changeUserPermissions(): void;
    leaveChannel(): void;
}
