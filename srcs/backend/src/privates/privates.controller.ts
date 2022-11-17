import {
	Controller, Get, Post, Patch, Delete, Param, Body,
	Query, Req, UseInterceptors, ClassSerializerInterceptor,
	HttpException, HttpStatus, ParseIntPipe
} from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
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
		@Req() req): Promise<PageDto<PrivateMessage>>
	{
		return this.privatesService.getMessages(pageOptionsDto);
	}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	createPrivateMessage(@Body() postPrivateDto: PostPrivateDto,
		@Req() req)
	{
		return this.privatesService.createMessage(postPrivateDto, req.user);
	}

	@Post('/:recipient')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	createPrivateMessageFromRecipientName(@Param('recipient') recipient: string,
		@Body() body: { content: string },
		@Req() req)
	{
		const postPrivateDto: PostPrivateDto = { recipient_name: recipient, content: body.content };
		return this.privatesService.createMessage(postPrivateDto, req.user);
	}

	@Patch('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	updatePrivateMessage(@Param('id', ParseIntPipe) id: number,
		@Query() updateMessageDto: UpdateMessageDto,
		@Req() req)
	{
		return this.privatesService.updateMessage(id, updateMessageDto);
	}

	@Delete('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	deletePrivateMessage(@Param('id', ParseIntPipe) id: number,
		@Req() req)
	{
		return this.privatesService.deleteMessage(id, req.user);
	}
}
