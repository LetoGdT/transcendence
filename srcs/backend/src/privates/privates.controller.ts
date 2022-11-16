import { Controller, Get, Post, Patch, Delete, Query, Req, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { AuthInterceptor } from '../auth/auth.interceptor';

@Controller('privmsg')
export class PrivatesController
{
	constructor(private readonly privatesService: PrivatesService,
		private readonly messagesService: MessagesService) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getPrivateMessages(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)//: Promise<PageDto<User>>
	{
		// return this.privatesService.getMessages(test.id);
	}

	@Post()
	createPrivateMessage()
	{
		return null;
	}

	@Patch()
	updatePrivateMessage()
	{
		return null
	}

	@Delete()
	deletePrivateMessage()
	{

	}
}
