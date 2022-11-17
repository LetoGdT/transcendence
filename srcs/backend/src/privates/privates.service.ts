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
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';

@Injectable()
export class PrivatesService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(PrivateMessage) private readonly privatesRepository: Repository<PrivateMessage>,
		private readonly usersService: UsersService,
		private readonly messagesService: MessagesService) {}

	async getMessages(pageOptionsDto: PageOptionsDto): Promise<PageDto<PrivateMessage>>
	{
		const queryBuilder = this.privatesRepository.createQueryBuilder("private");

		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.orderBy('private.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createMessage(postPrivateDto: PostPrivateDto, sender: User)
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

	async updateMessage(id: number, updateMessageDto: UpdateMessageDto)
	{
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);
		return await this.privatesRepository.update(id, updateMessageDto);
	}

	async deleteMessage(id: number, user: User): Promise<PrivateMessage>
	{
		const queryBuilder = this.privatesRepository.createQueryBuilder("private");
		
		queryBuilder
			.leftJoinAndSelect('private.message', 'message')
			.leftJoinAndSelect('message.recipient', 'recipient')
			.leftJoinAndSelect('message.sender', 'sender')
			.where("private.id = :id", { id: id })
			.andWhere("message.sender = :user_id", { user_id: user.id });

		const items = await queryBuilder.getManyAndCount();

		// items[1] is the count
		if (items[1] === 1)
		{
			// And items[0][0] is the private message
			const ret = await this.privatesRepository.remove(items[0][0]);
			await this.messagesService.deleteMessage(items[0][0].message);
			return items[0][0];
		}
		else
			throw new BadRequestException('Couldn\'t delete message');
	}
}
