import {
	Controller, Get, Post, Patch, Delete, Param, Body,
	Query, Req, UseInterceptors, ClassSerializerInterceptor,
	HttpException, HttpStatus, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from './conversations.service';
import { Message } from '../typeorm/message.entity';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto, ConversationQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
import {
	PostConversationDto, UpdateConversationMessageDto
} from '../dto/conversations.dto';
import { PostMessageDto } from '../dto/messages.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RequestWithUser } from '../interfaces/RequestWithUser.interface';

/**
* Get a conversation between 2 users (DMs).
* Data can only be read and created.
* 
* Notes:
* 	This works like a mini-channel with 2 users. It handles
* 	messages pretty much the same way as channels.
**/


@Controller('conversations')
export class ConversationsController
{
	constructor(private readonly conversationsService: ConversationsService,
		private readonly messagesService: MessagesService) {}

	/**
	* Get the latest conversations.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 	pageOptionsDto: cf. ../dto/page-options.dto.ts.
	* 	messageQueryFilterDto:
	* 		id (Number): The conversation's id.
	*	interlocutor_id: Select conversations with the given interlocutor.
	* 
	* Return: A PageDto of Conversations, filtered using the given pageOptionsDto.
	* 
	* Notes:
	* 	Run, you clever boy. And remember.
	**/

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getConversations(@Query() pageOptionsDto: PageOptionsDto,
		@Query() conversationQueryFilterDto: ConversationQueryFilterDto,
		@Req() req: RequestWithUser)
	{
		return this.conversationsService.getConversations(pageOptionsDto, conversationQueryFilterDto, req.user);
	}

	/**
	* Create a conversation.
	* 
	* Args:
	* 	:recipient_id (Number): The recipient's id.
	* 
	* Return: The created conversation.
	* 
	* Notes:
	* 	Fish fingers and custard.
	**/

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async createConversation(@Req() req: RequestWithUser,
		@Body() postConversationDto: PostConversationDto)
	{
		return this.conversationsService.createConversation(req.user, postConversationDto);
	}

	@Get('/:id/messages')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getConversationMessages(@Query() pageOptionsDto: PageOptionsDto,
		@Param('id', ParseIntPipe) id: number,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req: RequestWithUser): Promise<PageDto<Message>>
	{
		return this.conversationsService.getConversationMessages(pageOptionsDto, id,
			messageQueryFilterDto, userSelectDto, req.user);
	}

	/**
	* Get the messages of a conversation, with the current user as sender.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 	pageOptionsDto: cf. ../dto/page-options.dto.ts.
	* 	messageQueryFilterDto:
	* 		id (Number): The message's id.
	* 		start_at (Date): Return all messages sent after this date.
	* 		end_at (Date): Return all messages sent before this date.
	* 	userSelectDto:
	* 		sender_id: Select messages with the given userId as sender.
	* 		recipient_id: Select messages with the given userId as recipient.
	* 
	* Return: A PageDto of Messages, filtered using the given pageOptionsDto.
	* 
	* Notes:
	* 	I'm definitely a madman in a box.
	**/
	
	@Get('/:id/messages/as_sender')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getConversationMessagesAsSender(@Query() pageOptionsDto: PageOptionsDto,
		@Param('id', ParseIntPipe) id: number,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req: RequestWithUser): Promise<PageDto<Message>>
	{
		return this.conversationsService.getConversationMessages(pageOptionsDto, id,
			messageQueryFilterDto, userSelectDto, req.user, { as_sender: true });
	}

	/**
	* Get the messages of a conversation, with current user as recipient.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 	pageOptionsDto: cf. ../dto/page-options.dto.ts
	* 	messageQueryFilterDto:
	* 		id (Number): The message's id.
	* 		start_at (Date): Return all messages sent after this date.
	* 		end_at (Date): Return all messages sent before this date.
	* 	userSelectDto:
	* 		sender_id: Select messages with the given userId as sender.
	* 		recipient_id: Select messages with the given userId as recipient.
	* 
	* Return: A PageDto of Messages, filtered using the given pageOptionsDto.
	* 
	* Notes:
	* 	You have to reverse the polarity.
	**/

	@Get('/:id/messages/as_recipient')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getConversationMessagesAsRecipient(@Query() pageOptionsDto: PageOptionsDto,
		@Param('id', ParseIntPipe) id: number,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req: RequestWithUser): Promise<PageDto<Message>>
	{
		return this.conversationsService.getConversationMessages(pageOptionsDto, id,
			messageQueryFilterDto, userSelectDto, req.user, { as_recipient: true });
	}

	/**
	* Send a message in the conversation.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 	postConversationMessageDto:
	* 		content (string): The content of the message.
	* 		
	* 
	* Return: The created message.
	* 
	* Notes:
	* 	Fish fingers and custard.
	**/
	
	@Post('/:id/messages/')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	createConversationMessage(@Body() postMessageDto: PostMessageDto,
		@Param('id', ParseIntPipe) id: number,
		@Req() req: RequestWithUser)
	{
		return this.conversationsService.createConversationMessage(postMessageDto, id, req.user);
	}

	/**
	* Update a conversation message.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 	:message_id (Number): The message's id.
	* 	updateMessageDto:
	* 		content (string): The new content of the message.
	* 
	* Return: The updated message.
	* 
	* Notes:
	* 	Only in darkness are we revealed.
	* 	Goodness is not goodness that seeks advantage.
	* 	Good is good in the final hour, in the deepest pit, without hope, without witness, without reward.
	**/

	@Patch('/:id/messages/:message_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	updateConversationMessage(@Param('id', ParseIntPipe) id: number,
		@Param('message_id', ParseIntPipe) message_id: number,
		@Body() updateConversationMessageDto: UpdateConversationMessageDto,
		@Req() req: RequestWithUser)
	{
		return this.conversationsService.updateConversationMessage(updateConversationMessageDto,
			id, message_id, req.user);
	}

	/**
	* Delete a conversation message.
	* 
	* Args:
	* 	:id (Number): The conversation's id.
	* 
	* Return: The removed message.
	* 
	* Notes:
	* 	Geronimo !
	**/

	@Delete('/:id/messages/:message_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	deleteConversationMessage(@Param('id', ParseIntPipe) id: number,
		@Param('message_id', ParseIntPipe) message_id: number,
		@Req() req: RequestWithUser)
	{
		return this.conversationsService.deleteConversationMessage(id, message_id, req.user);
	}
}
