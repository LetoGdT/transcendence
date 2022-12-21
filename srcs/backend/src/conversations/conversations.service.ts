import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { Conversation } from '../typeorm/conversation.entity';
import { Message } from '../typeorm/message.entity';
import { User } from '../typeorm/user.entity';
import { PostConversationDto, PostConversationMessageDto, UpdateConversationMessageDto } from '../dto/conversations.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto, ConversationQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';

@Injectable()
export class ConversationsService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Conversation) private readonly conversationsRepository: Repository<Conversation>,
		@InjectRepository(Message) private readonly messagesRepository: Repository<Message>,
		private readonly messagesService: MessagesService,
		private readonly usersService: UsersService) {}

	async getConversations(pageOptionsDto: PageOptionsDto,
		conversationQueryFilterDto: ConversationQueryFilterDto,
		user: User)
	{
		const queryBuilder = this.conversationsRepository.createQueryBuilder("conversation");

		queryBuilder
			.leftJoinAndSelect('conversation.user1', 'user1')
			.leftJoinAndSelect('conversation.user2', 'user2')
			.where(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :user_id", { user_id: user.id })
			}))
			.andWhere(new Brackets(qb => {
				qb.where(conversationQueryFilterDto.user2_id != null
					? "conversation.user1 = :user2_id"
					: 'TRUE', { user2_id: conversationQueryFilterDto.user2_id })
				.orWhere(conversationQueryFilterDto.user2_id != null
					? "conversation.user2 = :user2_id"
					: 'TRUE', { user2_id: conversationQueryFilterDto.user2_id })
			}))
			.orderBy('conversation.latest_sent', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createConversation(user: User, postConversationDto: PostConversationDto): Promise<Conversation>
	{
		if (user.id == postConversationDto.recipient_id)
			throw new BadRequestException('You\'d better talk in your head!');

		const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation')
			.where(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :recipient_id", { recipient_id: postConversationDto.recipient_id })
			}))
			.orWhere(new Brackets(qb => {
				qb.where("conversation.user2 = :user_id", { user_id: user.id })
				.orWhere("conversation.user1 = :recipient_id", { recipient_id: postConversationDto.recipient_id })
			}));

		const count = await queryBuilder.getCount();

		if (count >= 1)
			throw new BadRequestException('Conversation already exists');

		const recipient = await this.usersService.getOneById(postConversationDto.recipient_id);

		if (recipient == null)
			throw new BadRequestException('User not found');

		const newConversation = await this.conversationsRepository.create({
			user1: user,
			user2: recipient,
		});
		return this.conversationsRepository.save(newConversation);
	}

	async getConversationMessages(pageOptionsDto: PageOptionsDto,
		conversation_id: number,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		options?: { as_sender?: boolean, as_recipient?: boolean }): Promise<PageDto<Message>>
	{
		if (conversation_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const count = await this.conversationsRepository.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.user1', 'user1')
			.leftJoinAndSelect('conversation.user2', 'user2')
			.where('conversation.id = :conversation_id', { conversation_id: conversation_id })
			.andWhere(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :user_id", { user_id: user.id })
			}))
			.getCount();

		if (count != 1)
			throw new HttpException('You are not a part of this conversation', HttpStatus.FORBIDDEN);

		const queryBuilder= this.messagesRepository.createQueryBuilder('message');

		queryBuilder
			.leftJoinAndSelect('message.sender', 'sender')
			.leftJoinAndSelect('message.conversation', 'conversation')
			.where('message.conversation = :conversation_id', { conversation_id: conversation_id })
			.andWhere(messageQueryFilterDto.id != null
				? 'message.id = :id'
				: 'TRUE', { id: messageQueryFilterDto.id })
			.andWhere(messageQueryFilterDto.start_at != null
				? 'message.sent_date > :start_at'
				: 'TRUE', { start_at: messageQueryFilterDto.start_at })
			.andWhere(messageQueryFilterDto.end_at != null
				? 'message.sent_date < :end_at'
				: 'TRUE', { end_at: messageQueryFilterDto.end_at })
			.andWhere(userSelectDto.sender_id != null
				? 'message.sender = :sender_id'
				: 'TRUE', { sender_id: userSelectDto.sender_id })
			.andWhere(options != null && options.as_sender === true
				? 'message.sender = :user_id'
				: 'TRUE', { user_id: user.id })
			.andWhere(options != null && options.as_recipient === true
				? 'message.sender IS NOT = :user_id'
				: 'TRUE', { user_id: user.id })
			.orderBy('message.sent_date', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createConversationMessage(postConversationMessageDto: PostConversationMessageDto,
		conversation_id: number,
		user: User): Promise<Conversation>
	{
		if (conversation_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.user1', 'user1')
			.leftJoinAndSelect('conversation.user2', 'user2')
			.leftJoinAndSelect('conversation.messages', 'messages')
			.where('conversation.id = :conversation_id', { conversation_id: conversation_id })
			.andWhere(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :user_id", { user_id: user.id })
			}));
			
		const count = await queryBuilder.getCount();

		if (count != 1)
			throw new HttpException('You are not a part of this conversation', HttpStatus.FORBIDDEN);

		const conversation = await queryBuilder.getOne();

		const userSelect = conversation.user1.id == user.id ? 'user2': 'user1'

		const queryBuilder2 = this.conversationsRepository.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.' + userSelect, userSelect)
			.leftJoinAndSelect(userSelect + '.banlist', 'banlist');

		const receiverConversation = await queryBuilder2.getOne();

		const receiver = receiverConversation[userSelect];

		if (receiver == null)
			throw new BadRequestException('An error occured');

		let bannedIndex: number = receiver.banlist.findIndex((user) => {
			return user.id == user.id;
		});

		if (bannedIndex != -1)
			throw new HttpException('You have been blocked by this user', HttpStatus.FORBIDDEN);

		const newMessage : Message = new Message();
		newMessage.sender = user;
		newMessage.content = postConversationMessageDto.content;
		conversation.latest_sent = newMessage.sent_date;

		conversation.messages.push(newMessage);
		return this.conversationsRepository.save(conversation);
	}

	async updateConversationMessage(updateConversationMessageDto: UpdateConversationMessageDto,
		conversation_id: number,
		message_id: number,
		user: User)
	{
		if (conversation_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.user1', 'user1')
			.leftJoinAndSelect('conversation.user2', 'user2')
			.leftJoinAndSelect('conversation.messages', 'messages')
			.leftJoinAndSelect('messages.sender', 'sender')
			.where('conversation.id = :conversation_id', { conversation_id: conversation_id })
			.andWhere(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :user_id", { user_id: user.id })
			}));
			
		const count = await queryBuilder.getCount();

		if (count != 1)
			throw new HttpException('You are not a part of this conversation', HttpStatus.FORBIDDEN);

		const conversation = await queryBuilder.getOne();

		let messageIndex: number = conversation.messages.findIndex((message) => {
			return message.id == message_id;
		});

		if (messageIndex === -1)
			throw new HttpException('Message not found', HttpStatus.NOT_FOUND);

		if (conversation.messages[messageIndex].sender.id != user.id)
			throw new HttpException('You can only modify your own messages', HttpStatus.FORBIDDEN);

		return this.messagesService.updateMessageFromId(message_id, updateConversationMessageDto.content);
	}

	async deleteConversationMessage(conversation_id: number,
		message_id: number,
		user: User)
	{
		if (conversation_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.user1', 'user1')
			.leftJoinAndSelect('conversation.user2', 'user2')
			.leftJoinAndSelect('conversation.messages', 'messages')
			.leftJoinAndSelect('messages.sender', 'sender')
			.where('conversation.id = :conversation_id', { conversation_id: conversation_id })
			.andWhere(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :user_id", { user_id: user.id })
			}));
			
		const count = await queryBuilder.getCount();

		if (count != 1)
			throw new HttpException('You are not a part of this conversation', HttpStatus.FORBIDDEN);

		const conversation = await queryBuilder.getOne();

		let messageIndex: number = conversation.messages.findIndex((message) => {
			return message.id == message_id;
		});

		if (messageIndex === -1)
			throw new HttpException('Message not found', HttpStatus.NOT_FOUND);

		if (conversation.messages[messageIndex].sender.id != user.id)
			throw new HttpException('You can only modify your own messages', HttpStatus.FORBIDDEN);

		await this.messagesService.deleteMessage(conversation.messages[messageIndex]);
		
		conversation.messages.splice(messageIndex, 1);

		return this.conversationsRepository.save(conversation);
	}
}
