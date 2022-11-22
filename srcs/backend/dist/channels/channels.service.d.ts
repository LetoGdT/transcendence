import { Repository } from 'typeorm';
import { Channel } from '../typeorm/channel.entity';
import { User } from '../typeorm/user.entity';
import { PostChannelDto } from '../dto/channels.dto';
export declare class ChannelsService {
    private readonly channelRepository;
    constructor(channelRepository: Repository<Channel>);
    getChannels(): Promise<Channel[]>;
    createChannel(postChannelDto: PostChannelDto, requester: User): Promise<Channel>;
    joinChannel(id: number, requester: User): Promise<Channel>;
}
