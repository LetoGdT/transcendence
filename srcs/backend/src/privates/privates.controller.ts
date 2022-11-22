import {
	Controller, Get, Post, Patch, Delete, Param, Body,
	Query, Req, UseInterceptors, ClassSerializerInterceptor,
	HttpException, HttpStatus, ParseIntPipe
} from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrivatesService } from './privates.service';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';

@Controller('privmsg')
export class PrivatesController
{
	constructor(private readonly privatesService: PrivatesService,
		private readonly messagesService: MessagesService) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getPrivateMessages(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<PrivateMessage>>
	{
		return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user);
	}

	@Get('/as_sender')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getPrivateMessagesAsSender(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<PrivateMessage>>
	{
		return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_sender: true });
	}

	@Get('/as_recipient')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getPrivateMessagesAsRecipient(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<PrivateMessage>>
	{
		return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_recipient: true });
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
		return this.privatesService.updateMessage(id, updateMessageDto, req.user);
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
