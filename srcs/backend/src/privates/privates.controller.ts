import { Controller, Get } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';

@Controller('privmsg')
export class PrivatesController
{
	constructor(private readonly messagesService: MessagesService) {}

	@Get()
	getPrivateMessages()
	{
		return null;
	}
}
