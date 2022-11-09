import { Controller, Get, Post, Query, Body, Req, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PageDto } from '../dto/page.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { Message } from '../typeorm/message.entity';
import { AuthInterceptor } from '../auth/auth.interceptor';

// Probably removable after
import { UsersService } from '../users/users.service';
import { User } from '../typeorm/user.entity';

@Controller('messages')
export class MessagesController
{
	constructor(private readonly messagesService: MessagesService,
		private readonly usersService: UsersService,) {}

	@Get()
	async getMessages(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Message>>
	{
		return this.messagesService.getMessages(pageOptionsDto);
	}

	// This shouldn't exist, 
	@Post()
	@UseInterceptors(AuthInterceptor)
	async createMessage(@Body() body: { recipient: string, content: string },
		@Req() req)
	{
		const sender: User = req.user;
		console.log(body.recipient);
		const recipient: User = await this.usersService.getOneByLogin(body.recipient);
		return this.messagesService.createMessage(sender, recipient, body.content);
	}
}
