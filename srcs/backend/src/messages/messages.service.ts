import { Injectable } from '@nestjs/common';
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
	constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async getMessages(pageOptionsDto: PageOptionsDto,
		messageQueryFilterDto: MessageQueryFilterDto,
		userSelectDto: UserSelectDto,
		user: User,
		options?: { as_sender?: boolean, as_recipient?: boolean }): Promise<PageDto<Message>>
	{
		const queryBuilder = this.messageRepository.createQueryBuilder("message");

		queryBuilder
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
			.andWhere(userSelectDto.recipient_id != null
				? 'message.recipient = :recipient_id'
				: 'TRUE', { recipient_id: userSelectDto.recipient_id })
			.andWhere(new Brackets(qb => {
				qb.where("message.sender = :user_id", { user_id: user.id })
				.orWhere("message.recipient = :user_id", { user_id: user.id })
			}))
			.andWhere(options && options.as_sender == true
				? 'message.sender = :user_id'
				: 'TRUE', { user_id: user.id })
			.andWhere(options && options.as_recipient == true
				? 'message.recipient = :user_id'
				: 'TRUE', { user_id: user.id })
			.leftJoinAndSelect('message.sender', 'sender')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.orderBy('message.sent_date', 'ASC')
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createMessage(sender: User, recipient: User, content: string)
	{
		const newMessage : Message = this.messageRepository.create({
			sender: sender,
			recipient: recipient,
			content: content
		});
		return this.messageRepository.save(newMessage);
	}

	// This function needs to be used if you are ABSOLUTELY SURE the message is valid and checked.
	// This is just because it seems you can't delete on cascade with unidirectionnal relations.
	async deleteMessage(message: Message)
	{
		this.messageRepository.remove(message);
	}
}
