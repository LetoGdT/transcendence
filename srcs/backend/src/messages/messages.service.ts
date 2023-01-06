import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Message } from '../typeorm/message.entity';
import { User } from '../typeorm/user.entity';
import { UserSelectDto } from '../dto/messages.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';


@Injectable()
export class MessagesService
{
	IdMax = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async getMessages(pageOptionsDto: PageOptionsDto,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		options?: { as_sender?: boolean, as_recipient?: boolean }): Promise<PageDto<Message>>
	{
		const queryBuilder = this.messageRepository.createQueryBuilder("message");

		queryBuilder
			.leftJoinAndSelect('message.sender', 'sender')
			.where(messageQueryFilterDto.id != null
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
			.andWhere("message.sender = :user_id", { user_id: user.id })
			.andWhere(options != null && options.as_sender === true
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

	async getChannelMessages(channel_id: number,
		pageOptionsDto: PageOptionsDto,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		as_sender?: boolean): Promise<PageDto<Message>>
	{
		const queryBuilder = this.messageRepository.createQueryBuilder("message");

		queryBuilder
			.leftJoinAndSelect('message.sender', 'sender')
			.leftJoinAndSelect('message.channel', 'channel')
			.where('channel.id = :channel_id', { channel_id: channel_id })
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
			.orderBy('message.sent_date', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createMessage(sender: User, content: string)
	{
		const newMessage : Message = this.messageRepository.create({
			sender: sender,
			content: content
		});
		return this.messageRepository.save(newMessage);
	}

	// Doesn't check if the message is valid, only to be used when it is
	async updateMessage(message: Message)
	{
		return this.messageRepository.save(message);
	}

	async updateMessageFromId(id: number, content: string)
	{
		if (id > this.IdMax)
			throw new BadRequestException(`channel_id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.messageRepository.createQueryBuilder("message");

		const message = await queryBuilder
			.where('message.id = :id', { id: id })
			.getOne();

		if (message == null)
			throw new HttpException("An unexpected error occured: invalid id", HttpStatus.INTERNAL_SERVER_ERROR)

		message.content = content;

		return this.messageRepository.save(message);
	}

	// This function needs to be used if you are ABSOLUTELY SURE the message is valid and checked.
	// This is just because it seems you can't delete on cascade with unidirectionnal relations.
	async deleteMessage(message: Message)
	{
		this.messageRepository.remove(message);
	}
}
