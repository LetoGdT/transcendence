import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Conversation } from '../typeorm/conversation.entity';
import { User } from '../typeorm/user.entity';
import { PostConversationDto } from '../dto/conversations.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";

@Injectable()
export class ConversationsService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Conversation) private readonly conversationsRepository: Repository<Conversation>,
		private readonly usersService: UsersService,) {}

	async getConversations(pageOptionsDto: PageOptionsDto,
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
			.orderBy('conversation.id', pageOptionsDto.order)
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

		const newConversation = await this.conversationsRepository.create({
			user1: user,
			user2: recipient,
		});
		return this.conversationsRepository.save(newConversation);
	}

}
