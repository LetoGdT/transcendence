import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Conversation } from '../typeorm/conversation.entity';
import { User } from '../typeorm/user.entity';

@Injectable()
export class ConversationsService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Conversation) private readonly conversationsRepository: Repository<Conversation>,
		) {}

	async createConversation(user: User)
	{
		const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation')
			// .leftJoinAndSelect('conversation.user1', 'user1')
			// .leftJoinAndSelect('conversation.user2', 'user2')
			.where(new Brackets(qb => {
				qb.where("conversation.user1 = :user_id", { user_id: user.id })
				.orWhere("conversation.user2 = :recipient_id", { recipient_id: user.id })
			}))
			.orWhere(new Brackets(qb => {
				qb.where("conversation.user2 = :user_id", { user_id: user.id })
				.orWhere("conversation.user1 = :recipient_id", { recipient_id: user.id })
			}));
	}

}
