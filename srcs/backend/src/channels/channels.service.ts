import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Channel } from '../typeorm/channel.entity';
// import { ChannelUser } from '../typeorm/channel-user.entity';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PostChannelDto } from '../dto/channels.dto';
import { PatchChannelDto } from '../dto/channels.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService
{
	IdMax = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
		@InjectRepository(ChannelUser) private readonly channelUserRepository: Repository<ChannelUser>)
		{}

	async getChannels(pageOptionsDto: PageOptionsDto, user: User): Promise<PageDto<Channel>>
	{
		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.orderBy('channel.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async getChannelUsers(pageOptionsDto: PageOptionsDto, id: number, user: User): Promise<PageDto<ChannelUser>>
	{
		const queryBuilder = this.channelUserRepository.createQueryBuilder('channelUser');

		queryBuilder
			.leftJoinAndSelect('channelUser.user', 'user')
			.where('channelUser.channel = :id', { id: id })
			.orderBy('channelUser.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
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

	async updateChannel(id: number, patchChannelDto: PatchChannelDto,  user: User)
	{
		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :id', { id: id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new BadRequestException('Channel not found');

		let channelUser: ChannelUser = null;

		for (let tmp_channelUser of channel.users)
		{
			if (JSON.stringify(tmp_channelUser.user) === JSON.stringify(user))
			{
				channelUser = tmp_channelUser;
				break;
			}
		}

		if (channelUser.role === 'None')
			throw new HttpException('You are not a channel administrator', HttpStatus.FORBIDDEN);

		channel.status = patchChannelDto.status;

		if (channel.status == 'protected')
		{
			if (patchChannelDto.password == null)
				throw new BadRequestException('A password is expected for protected channels');
			channel.password = await bcrypt.hash(patchChannelDto.password, 10);
		}

		else
			channel.password = null;

		return this.channelRepository.save(channel);
	}

	// Check if user is already in the channel
	async joinChannel(id: number, requester: User, password?: string): Promise<Channel>
	{
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :id', { id: id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new BadRequestException('Channel not found');

		if (channel.status == 'private')
			throw new BadRequestException('This channel is private');

		if (channel.status == 'protected')
		{
			const isMatch: boolean = await bcrypt.compare(password, channel.password);
			if (!isMatch)
				throw new BadRequestException('Passwords don\'t match');
		}

		for (let channelUser of channel.users)
		{
			if (channelUser.user == requester)
				return channel;
		}

		const newUser = new ChannelUser();
		newUser.user = requester;
		newUser.role = 'None';

		channel.users.push(newUser);
		console.log(channel);
		console.log(channel.users);
		// return this.channelRepository.save(channel);
	}
}
