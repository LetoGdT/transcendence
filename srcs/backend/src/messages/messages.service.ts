import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../typeorm/message.entity';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";


@Injectable()
export class MessagesService
{
	constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

	async getMessages(pageOptionsDto: PageOptionsDto,
		/*messageQueryFilterDto: MessageQueryFilterDto*/): Promise<PageDto<Message>>
	{
		const queryBuilder = this.messageRepository.createQueryBuilder("message");

		queryBuilder
			// .where(pageOptionsDto['id'] != null
			// 	? 'message.id = :id'
			// 	: 'TRUE', { id: messageQueryFilterDto.id })
			.orderBy("message.id", pageOptionsDto.order)
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
}
