import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../typeorm/message.entity';

@Injectable()
export class MessagesService
{
	constructor(@InjectRepository(Message) private readonly userRepository: Repository<Message>) {}
}
