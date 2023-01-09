import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from '../typeorm/channel.entity';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { Message } from '../typeorm/message.entity';
import { MessagesService } from '../messages/messages.service';
import { AchievementsService } from '../achievements/achievements.service';
import { PostChannelDto, PatchChannelUserDto, PatchChannelDto } from '../dto/channels.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto, Order } from "../dto/page-options.dto";
import { MessageQueryFilterDto, ChannelQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto, PostMessageDto, UpdateMessageDto } from '../dto/messages.dto';
import { UserQueryFilterDto, ChannelUserQueryFilterDto } from '../dto/query-filters.dto';
import { ChannelBanQueryFilterDto, PostChannelBanDto, UpdateChannelBanDto } from '../dto/channel-ban.dto';
import { ChannelBan } from '../typeorm/channel-ban.entity';

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
		@InjectRepository(ChannelBan) private readonly channelBanRepository: Repository<ChannelBan>,
		private readonly messagesService: MessagesService,
		private readonly achievementsService: AchievementsService)
		{}

	async getChannels(pageOptionsDto: PageOptionsDto,
		channelQueryFilterDto: ChannelQueryFilterDto, user: User): Promise<PageDto<Channel>>
	{
		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'channelUser')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.leftJoinAndSelect('banlist.user', 'channelBan')
			.where(channelQueryFilterDto.id != null
				? 'channel.id = :id'
				: 'TRUE', { id: channelQueryFilterDto.id })
			.andWhere(channelQueryFilterDto.name != null
				? 'channel.name = :name'
				: 'TRUE', { name: channelQueryFilterDto.name })
			.andWhere(channelQueryFilterDto.status != null
				? 'channel.status = :status'
				: 'TRUE', { status: channelQueryFilterDto.status })
			.orderBy('channel.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async getChannelUsers(pageOptionsDto: PageOptionsDto, userQueryFilterDto: UserQueryFilterDto,
		channelUserQueryFilterDto: ChannelUserQueryFilterDto,
		channel_id: number, user: User): Promise<PageDto<ChannelUser>>
	{
		const channelQueryBuilder = this.channelRepository.createQueryBuilder('channel');

		channelQueryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :id', { id: channel_id });

		const channel = await channelQueryBuilder.getOne();

		if (channel == null)
			throw new BadRequestException('Channel not found');

		const queryBuilder = this.channelUserRepository.createQueryBuilder('channelUser');

		queryBuilder
			.leftJoinAndSelect('channelUser.user', 'user')
			.where('channelUser.channel = :id', { id: channel_id })
			.andWhere(channelUserQueryFilterDto.role != null
				? 'channelUser.role = :role'
				: 'TRUE', { role: channelUserQueryFilterDto.role })
			.andWhere(userQueryFilterDto.id != null
				? 'user.id = :id'
				: 'TRUE', { id: userQueryFilterDto.id })
			.andWhere(userQueryFilterDto.uid != null
				? 'user.uid = :uid'
				: 'TRUE', { uid: userQueryFilterDto.uid })
			.andWhere(userQueryFilterDto.username != null
				? 'user.username LIKE :username'
				: 'TRUE', { username: userQueryFilterDto.username })
			.andWhere(userQueryFilterDto.email != null
				? 'user.email LIKE :email'
				: 'TRUE', { email: userQueryFilterDto.email })
			.andWhere(userQueryFilterDto.image_url != null
				? 'user.image_url LIKE :image_url'
				: 'TRUE', { image_url: userQueryFilterDto.image_url })
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
		const queryBuilder = this.channelRepository.createQueryBuilder('channel')
			.where('channel.name = :name', { name: postChannelDto.name })
			
		const count = await queryBuilder.getCount();

		if (count >= 1)
			throw new BadRequestException('A channel with this name already exists');

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

		let channelUser: ChannelUser | null = null;

		for (let tmp_channelUser of channel.users)
		{
			if (JSON.stringify(tmp_channelUser.user) === JSON.stringify(user))
			{
				channelUser = tmp_channelUser;
				break;
			}
		}

		if (channelUser == null)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

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
			.leftJoinAndSelect('users.user', 'channelUser')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.leftJoinAndSelect('banlist.user', 'banlistUser')
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

		let bannedIndex: number = channel.banlist.findIndex((users) => {
			return users.user.id == requester.id;
		});

		if (bannedIndex !== -1)
		{
			const bannedUser = channel.banlist[bannedIndex];
			if (bannedUser.unban_date == null || bannedUser.unban_date > new Date())
				throw new HttpException('You are banned from this channel', HttpStatus.FORBIDDEN);
			this.channelBanRepository.remove(bannedUser);
		}

		for (let channelUser of channel.users)
		{
			if (JSON.stringify(channelUser.user) == JSON.stringify(requester))
				throw new BadRequestException('You are already in this channel');
		}

		const newUser = new ChannelUser();
		newUser.user = requester;
		newUser.role = 'None';

		channel.users.push(newUser);
		return this.channelRepository.save(channel);
	}

	async updateChannelUser(channel_id: number, user_id: number, user: User,
		patchChannelUserDto: PatchChannelUserDto)
	{
		if (channel_id > this.IdMax || user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException("An unexpected error occured: invalid channel id",
				HttpStatus.INTERNAL_SERVER_ERROR);

		let requester: ChannelUser | null = null;
		let toChange: ChannelUser | null = null;

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

		if (patchChannelUserDto.role != null
			&& this.permissions.get(requester.role) > this.permissions.get(toChange.role)
			&& this.permissions.get(patchChannelUserDto.role) <= this.permissions.get(requester.role))
		{
			channel.users[toChangeIndex].role = patchChannelUserDto.role;
			if (patchChannelUserDto.role == 'Owner')
				channel.users[requesterIndex].role = 'Admin';
		}
		else
			throw new HttpException('You don\'t have permissions to execute this action', HttpStatus.FORBIDDEN);
		if (patchChannelUserDto.is_muted != null
			&& this.permissions.get(requester.role) > this.permissions.get(toChange.role))
			channel.users[toChangeIndex].is_muted = patchChannelUserDto.is_muted;
		else
			throw new HttpException('You don\'t have permissions to execute this action', HttpStatus.FORBIDDEN);

		return this.channelRepository.save(channel);
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

		let requester: ChannelUser | null = null;
		let toDelete: ChannelUser | null = null;

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

	async createChannelMessage(channel_id: number, postMessageDto: PostMessageDto, sender: User)
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

		if (channel.users[senderIndex].is_muted == true)
			throw new HttpException('You are muted on this channel', HttpStatus.FORBIDDEN);

		const newMessage : Message = new Message();

		newMessage.sender = sender;
		newMessage.content = postMessageDto.content;

		channel.latest_sent = newMessage.sent_date;

		channel.messages.push(newMessage);
		const ret = await this.channelRepository.save(channel);
		try
		{
			await this.achievementsService.createUserAchievement(sender, 'I\'m a sociable person');
		}
		catch (err)
		{
			console.log('No achievement for you');
		}
		return ret;
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

		if (channel.messages[messageIndex].sender.id != sender.id)
			throw new HttpException('You can only delete your own messages', HttpStatus.FORBIDDEN);

		await this.messagesService.deleteMessage(channel.messages[messageIndex]);
		
		channel.messages.splice(messageIndex, 1);

		return this.channelRepository.save(channel);
	}

	async getConversations(pageOptionsDto: PageOptionsDto, user: User)
	{
		const queryBuilder = this.channelUserRepository.createQueryBuilder('channelUser');

		queryBuilder
			.leftJoinAndSelect('channelUser.user', 'user')
			.leftJoinAndSelect('channelUser.channel', 'channel')
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.where('user.id = :id', { id: user.id })
			.andWhere('channel.latest_sent is not null')
			.orderBy('channel.latest_sent', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities.map(entity => entity.channel), pageMetaDto);
	}

	async getChannelBanlist(channel_id: number, pageOptionsDto: PageOptionsDto,
		channelBanQueryFilterDto: ChannelBanQueryFilterDto): Promise<PageDto<ChannelBan>>
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelBanRepository.createQueryBuilder('channelBan');

		queryBuilder
			.leftJoinAndSelect('channelBan.user', 'user')
			.leftJoinAndSelect('channelBan.channel', 'channel')
			.where('channel.id = :channel_id', { channel_id: channel_id })
			.andWhere(channelBanQueryFilterDto.user_id != null
				? 'user.id = :id'
				: 'TRUE', { id: channelBanQueryFilterDto.user_id })
			.andWhere(channelBanQueryFilterDto.start_at != null
				? 'channelBan.unban_date > :start_at'
				: 'TRUE', { start_at: channelBanQueryFilterDto.start_at })
			.andWhere(channelBanQueryFilterDto.end_at != null
				? 'channelBan.unban_date < :end_at'
				: 'TRUE', { end_at: channelBanQueryFilterDto.end_at })
			.orderBy('channelBan.unban_date', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async banChannelUser(channel_id: number, postChannelBanDto: PostChannelBanDto, user: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		let bannedIndex: number = channel.banlist.findIndex((users) => {
			return users.user.id == postChannelBanDto.user_id;
		});

		if (bannedIndex !== -1)
			throw new BadRequestException('User is already banned');

		const users = channel.users;

		let userIndex: number = users.findIndex((users) => {
			return users.user.id === user.id;
		});

		if (userIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		let toBanIndex: number = users.findIndex((users) => {
			return users.user.id == postChannelBanDto.user_id;
		});

		if (toBanIndex === -1)
			throw new HttpException('User was not found', HttpStatus.NOT_FOUND);

		if (toBanIndex === userIndex)
			throw new BadRequestException('You can\'t ban yourself !');

		if (this.permissions.get(users[userIndex].role) <= this.permissions.get(users[toBanIndex].role))
			throw new HttpException('You can\'t ban a user with a higher or equal role', HttpStatus.FORBIDDEN);

		const bannedUser = new ChannelBan();

		bannedUser.user = users[toBanIndex].user;
		bannedUser.unban_date = postChannelBanDto.unban_date;

		channel.banlist.push(bannedUser);
		channel.users.splice(toBanIndex, 1);
		return this.channelRepository.save(channel);
	}

	async updateChannelBan(channel_id: number, ban_id: number, updateChannelBanDto: UpdateChannelBanDto, user: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		const banlist = channel.banlist;

		let userIndex: number = channel.users.findIndex((users) => {
			return users.user.id === user.id;
		});

		if (userIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		let bannedIndex: number = banlist.findIndex((users) => {
			return users.id == ban_id;
		});

		if (bannedIndex === -1)
			throw new HttpException('User ban was not found', HttpStatus.NOT_FOUND);

		if (banlist[bannedIndex].id === user.id)
			throw new BadRequestException('You can\'t unban yourself !');

		if (this.permissions.get(channel.users[userIndex].role) < this.permissions.get('Admin'))
			throw new HttpException('You need to be admin or owner to edit a ban', HttpStatus.FORBIDDEN);

		channel.banlist[bannedIndex].unban_date = updateChannelBanDto.unban_date;
		return this.channelRepository.save(channel);
	}

	async deleteChannelBan(channel_id: number, ban_id: number, user: User)
	{
		if (channel_id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.channelRepository.createQueryBuilder('channel');

		queryBuilder
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('users.user', 'user')
			.leftJoinAndSelect('channel.banlist', 'banlist')
			.where('channel.id = :channel_id', { channel_id: channel_id });

		const channel = await queryBuilder.getOne();

		if (channel == null)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		const banlist = channel.banlist;

		let userIndex: number = channel.users.findIndex((users) => {
			return users.user.id === user.id;
		});

		if (userIndex === -1)
			throw new HttpException('You are not in this channel', HttpStatus.FORBIDDEN);

		let bannedIndex: number = banlist.findIndex((users) => {
			return users.id == ban_id;
		});

		if (bannedIndex === -1)
			throw new HttpException('User ban was not found', HttpStatus.NOT_FOUND);

		if (banlist[bannedIndex].id === user.id)
			throw new BadRequestException('You can\'t unban yourself !');

		if (this.permissions.get(channel.users[userIndex].role) < this.permissions.get('Admin'))
			throw new HttpException('You need to be admin or owner to edit a ban', HttpStatus.FORBIDDEN);

		this.channelBanRepository.remove(banlist[bannedIndex]);
		channel.banlist.splice(bannedIndex, 1);
		return this.channelRepository.save(channel);
	}
}
