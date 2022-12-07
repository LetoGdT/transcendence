import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Conversation } from '../typeorm/conversation.entity';

@Injectable()
export class ConversationsService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Conversation) private readonly conversationsRepository: Repository<Conversation>,
		) {}

	async createConversation(user: User)
	{

	}

}
