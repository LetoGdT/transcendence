import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from '../typeorm/channel.entity';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { Message } from '../typeorm/message.entity';
import { MessagesService } from '../messages/messages.service';
import { PostChannelDto } from '../dto/channels.dto';
import { PatchChannelDto } from '../dto/channels.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
import { UserSelectDto } from '../dto/messages.dto';

@Injectable()
export class ChannelsService
{
	IdMax = Number.MAX_SAFE_INTEGER;
	permissions = new Map<string, number>([
		["Owner", 2],
		["Admin", 1],
		["None", 0],
	]);

	constructor(@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
		@InjectRepository(ChannelUser) private readonly channelUserRepository: Repository<ChannelUser>,
		private readonly messagesService: MessagesService)
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
	async joinChannel(id: number, requester: User, password: string): Promise<Channel>
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
			if (password == null)
				throw new BadRequestException('A password is expected for protected channels');
			const isMatch: boolean = await bcrypt.compare(password, channel.password);
			if (!isMatch)
				throw new HttpException('Passwords don\'t match', HttpStatus.FORBIDDEN);
		}

		for (let channelUser of channel.users)
		{
			if (JSON.stringify(channelUser.user) == JSON.stringify(requester))
				return channel;
		}

		const newUser = new ChannelUser();
		newUser.user = requester;
		newUser.role = 'None';

		channel.users.push(newUser);
		return this.channelRepository.save(channel);
	}

	async updateChannelUser(channel_id: number, user_id: number, user: User,
		role: 'None' | 'Admin' | 'Owner')
	{
		if (channel_id > this.IdMax || user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		let requester: ChannelUser = null;
		let toChange: ChannelUser = null;

		for (let channelUser of channel.users)
		{
			if (JSON.stringify(channelUser.user) == JSON.stringify(user))
				requester = channelUser;
			if (channelUser.id == user_id)
				toChange = channelUser;
		}

		if (requester == null)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);
		if (toChange == null)
			throw new BadRequestException('User not found');
		if (channel == null)
			throw new BadRequestException('Channel not found');
		if (requester.id == toChange.id)
			throw new BadRequestException('You can\'t modify your own role !');

		const toChangeIndex = channel.users.findIndex((user) => {
			return user.id === toChange.id;
		});

		const requesterIndex = channel.users.findIndex((user) => {
			return user.id === requester.id;
		});

		if (this.permissions.get(requester.role) > this.permissions.get(toChange.role)
			&& this.permissions.get(role) <= this.permissions.get(requester.role))
		{
			channel.users[toChangeIndex].role = role;
			if (role == 'Owner')
				channel.users[requesterIndex].role = 'Admin';
			return this.channelRepository.save(channel);
		}
		throw new HttpException('You don\'t have permissions to execute this action', HttpStatus.FORBIDDEN);
	}

	findToPromote(users: ChannelUser[]): number
	{
		let toPromoteIndex = users.findIndex((user) => {
			return user.role === 'Admin';
		});
		if (toPromoteIndex !== -1)
			return toPromoteIndex;

		return users.findIndex((user) => {
			return user.role === 'None';
		});
	}

	async deleteChannelUser(channel_id: number, user_id: number, user: User): Promise<Channel>
	{
		if (channel_id > this.IdMax || user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		let requester: ChannelUser = null;
		let toDelete: ChannelUser = null;

		for (let channelUser of channel.users)
		{
			if (JSON.stringify(channelUser.user) == JSON.stringify(user))
				requester = channelUser;
			if (channelUser.id == user_id)
				toDelete = channelUser;
		}

		if (requester == null)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);
		if (toDelete == null)
			throw new BadRequestException('User not found');
		if (channel == null)
			throw new BadRequestException('Channel not found');

		const toDeleteIndex = channel.users.findIndex((user) => {
			return user.id === toDelete.id;
		});

		if (requester.id == toDelete.id
			|| this.permissions.get(requester.role) > this.permissions.get(toDelete.role))
		{
			if (channel.users.length === 1)
			{
				await queryBuilder.delete().where("id = :id", { id: channel_id }).execute();
				channel.users = [];
				return channel;
			}
			channel.users.splice(toDeleteIndex, 1);
			if (toDelete.role == 'Owner')
				channel.users[this.findToPromote(channel.users)].role = 'Owner';
			await this.channelUserRepository.remove(toDelete);
			return this.channelRepository.save(channel);
		}

		throw new HttpException('You can\'t delete a user with a higher or equal role', HttpStatus.FORBIDDEN);
	}

	async getChannelMessages(channel_id: number,
		pageOptionsDto: PageOptionsDto,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		as_sender?: boolean): Promise<PageDto<Message>>
	{
		return await this.messagesService.getChannelMessages(channel_id, pageOptionsDto,
			messageQueryFilterDto, userSelectDto, user, as_sender);
	}

	async createChannelMessage(channel_id: number, postPrivateDto: PostPrivateDto, sender: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.messages', 'messages')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);

		let senderIndex: number = channel.users.findIndex((user) => {
			return user.user.id === sender.id;
		});

		if (senderIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		const newMessage : Message = new Message();

		newMessage.sender = sender;
		newMessage.content = postPrivateDto.content;

		channel.messages.push(newMessage);
		return this.channelRepository.save(channel);
	}

	async updateChannelMessage(channel_id: number, message_id: number,
		updateMessageDto: UpdateMessageDto, sender: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.messages', 'messages')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		let senderIndex: number = channel.users.findIndex((user) => {
			return user.user.id === sender.id;
		});

		if (senderIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		let messageIndex: number = channel.messages.findIndex((message) => {
			return message.id == message_id;
		});

		if (messageIndex === -1)
			throw new HttpException('Message not found', HttpStatus.NOT_FOUND);

		if (channel.messages[messageIndex].sender.id != sender.id)
			throw new HttpException('You can only modify your own messages', HttpStatus.FORBIDDEN);

		return this.messagesService.updateMessageFromId(message_id, updateMessageDto.content);
	}

	async deleteChannelMessage(channel_id: number, message_id: number, sender: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.messages', 'messages')
			.leftJoinAndSelect('messages.sender', 'sender')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		let senderIndex: number = channel.users.findIndex((user) => {
			return user.user.id === sender.id;
		});

		if (senderIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		let messageIndex: number = channel.messages.findIndex((message) => {
			return message.id == message_id;
		});

		if (messageIndex === -1)
			throw new HttpException('Message not found', HttpStatus.NOT_FOUND);

		console.log(channel.messages[messageIndex])

		if (channel.messages[messageIndex].sender.id != sender.id)
			throw new HttpException('You can only delete your own messages', HttpStatus.FORBIDDEN);

		await this.messagesService.deleteMessage(channel.messages[messageIndex]);
		
		channel.messages.splice(messageIndex, 1);

		return this.channelRepository.save(channel);
	}
}
