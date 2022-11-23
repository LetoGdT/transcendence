import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { User } from '../typeorm/user.entity';
import { Message } from '../typeorm/message.entity';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { UserSelectDto } from '../dto/messages.dto';
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';

@Injectable()
export class PrivatesService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(PrivateMessage) private readonly privatesRepository: Repository<PrivateMessage>,
		private readonly usersService: UsersService,
		private readonly messagesService: MessagesService) {}

	async getMessages(pageOptionsDto: PageOptionsDto,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		options?: { as_sender?: boolean, as_recipient?: boolean }): Promise<PageDto<PrivateMessage>>
	{
		const queryBuilder = this.privatesRepository.createQueryBuilder("private");

		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.where(messageQueryFilterDto.id != null
				? 'private.id = :id'
				: 'TRUE', { id: messageQueryFilterDto.id })
			.andWhere(messageQueryFilterDto.message_id != null
				? 'message.id = :message_id'
				: 'TRUE', { message_id: messageQueryFilterDto.message_id })
			.andWhere(messageQueryFilterDto.start_at != null
				? 'message.sent_date > :start_at'
				: 'TRUE', { start_at: messageQueryFilterDto.start_at })
			.andWhere(messageQueryFilterDto.end_at != null
				? 'message.sent_date < :end_at'
				: 'TRUE', { end_at: messageQueryFilterDto.end_at })
			.andWhere(userSelectDto.sender_id != null
				? 'message.sender = :sender_id'
				: 'TRUE', { sender_id: userSelectDto.sender_id })
			.andWhere(userSelectDto.recipient_id != null
				? 'message.recipient = :recipient_id'
				: 'TRUE', { recipient_id: userSelectDto.recipient_id })
			.andWhere(new Brackets(qb => {
				qb.where("message.sender = :user_id", { user_id: user.id })
				.orWhere("message.recipient = :user_id", { user_id: user.id })
			}))
			.andWhere(options && options.as_sender == true
				? 'message.recipient = :user_id'
				: 'TRUE', { user_id: user.id })
			.andWhere(options && options.as_recipient == true
				? 'message.sender = :user_id'
				: 'TRUE', { user_id: user.id })
			.orderBy('message.sent_date', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createMessage(postPrivateDto: PostPrivateDto, sender: User): Promise<PrivateMessage>
	{
		let recipient: User;
		if (postPrivateDto.recipient_id != null)
			recipient = await this.usersService.getOneById(postPrivateDto.recipient_id);
		else if (postPrivateDto.recipient_name != null)
			recipient = await this.usersService.getOneByLogin(postPrivateDto.recipient_name);
		else
			throw new HttpException('Neither login or id were provided', HttpStatus.INTERNAL_SERVER_ERROR);

		if (recipient == null)
			throw new BadRequestException('User not found');
		const message: Message = await this.messagesService.createMessage(sender, recipient, postPrivateDto.content);
		const privateMessage = new PrivateMessage()
		privateMessage.message = message;
		return this.privatesRepository.save(privateMessage);
	}

	// select distinct id from (
	// 	select distinct senderId as id, recipientId from message
	// 		where recipientId = "user_id"
	// 	inner join (
	// 		select senderId, distinct recipientId as id from message
	// 			where senderId = "user_id") as messages_sent
	// on true) as foo

	async getConversations(user: User)
	{
		const queryBuilder = this.privatesRepository.createQueryBuilder("private");

		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.where(new Brackets(qb => {
				qb.where("message.sender = :user_id", { user_id: user.id })
				.orWhere("message.recipient = :user_id", { user_id: user.id })
			}))
			.distinctOn(['sender', 'recipient']);

		// console.log();
		return await queryBuilder.getMany();
	}

	async updateMessage(id: number, updateMessageDto: UpdateMessageDto, user: User)
	{
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.privatesRepository.createQueryBuilder("private");
		
		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.where("private.id = :id", { id: id })
			.andWhere("message.sender = :user_id", { user_id: user.id });

		const items = await queryBuilder.getManyAndCount();

		if (items[1] !== 1)
			throw new BadRequestException('Couldn\'t update message');

		const priv = items[0][0];

		priv.message.content = updateMessageDto.content;
		await this.messagesService.updateMessage(priv.message);
		return priv;
	}

	async deleteMessage(id: number, user: User): Promise<PrivateMessage>
	{
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.privatesRepository.createQueryBuilder("private");
		
		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.where("private.id = :id", { id: id })
			.andWhere("message.sender = :user_id", { user_id: user.id });

		const items = await queryBuilder.getManyAndCount();

		// items[1] is the count
		if (items[1] !== 1)
			throw new BadRequestException('Couldn\'t delete message');

		// And items[0][0] is the private message
		const ret = await this.privatesRepository.remove(items[0][0]);
		await this.messagesService.deleteMessage(items[0][0].message);
		return items[0][0];
	}
}
