import {
	Controller, Get, Post, Query, Body, Req,
	UseInterceptors, ClassSerializerInterceptor, UseGuards
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PageDto } from '../dto/page.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { UserSelectDto } from '../dto/messages.dto';
import { Message } from '../typeorm/message.entity';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('messages')
export class MessagesController
{
	constructor(private readonly messagesService: MessagesService,
		private readonly usersService: UsersService,) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getMessages(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<Message>>
	{
		return this.messagesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user);
	}

	@Get('/as_sender')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getMessagesAsSender(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<Message>>
	{
		return this.messagesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_sender: true });
	}

	@Get('/as_recipient')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getMessagesAsRecipient(@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req): Promise<PageDto<Message>>
	{
		return this.messagesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_recipient: true });
	}
}
