import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Channel } from '../typeorm/channel.entity';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PostChannelDto } from '../dto/channels.dto';

@Injectable()
export class ChannelsService
{
	constructor(@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>)
		{}

	async getChannels()
	{
		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user');

		return queryBuilder.getMany();
	}

	async createChannel(postChannelDto: PostChannelDto, requester: User): Promise<Channel>
	{
		const owner = new ChannelUser();
		owner.user = requester;
		owner.role = 'Owner';
		const newChannel = await this.channelRepository.create({
			name: postChannelDto.name,
			users: [owner],
			status: 'private',
		});
		return this.channelRepository.save(newChannel);
	}

	// L'id du channel, le user, le mot de passe du channel
	async joinChannel(id: number, requester: User)
	{
		const newUser = new ChannelUser();
		newUser.user = requester;
		newUser.role = 'None';

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			// .where('channel.id = :id', { id: id });

		const channel = await queryBuilder.getOne();
		channel.users.push(newUser);
		console.log(channel);
		console.log(channel.users);
		return this.channelRepository.save(channel);
	}
}
