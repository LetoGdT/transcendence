import {
	Controller, Req, Body, Get, Post, Patch, Delete,
	UseInterceptors, ClassSerializerInterceptor,
	Param, ParseIntPipe, Query, UseGuards
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Channel } from '../typeorm/channel.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostChannelDto, PatchChannelDto, PatchChannelUserDto } from '../dto/channels.dto';
import { MessageQueryFilterDto, ChannelQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto, PostMessageDto, UpdateMessageDto } from '../dto/messages.dto';
import { ChannelBanQueryFilterDto, PostChannelBanDto, UpdateChannelBanDto } from '../dto/channel-ban.dto';
import { UserQueryFilterDto, ChannelUserQueryFilterDto } from '../dto/query-filters.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';

/**
* A channel, where multiple users can communicate.
* Has a name, and contains a list of users, a list of messages, a banlist,
* a password and a status.
* 
* Notes:
* 	Linked to ChannelBan, ChannelUser and Message
**/


@Controller('channels')
export class ChannelsController
{
	constructor(private readonly channelsService: ChannelsService) {}

	/**
	* Get a list of all channels.
	* 
	* Args:
	* 	pageOptionsDto: cf. ../dto/page-options.dto.ts.
	* 	channelQueryFilterDto:
	* 		id (Number): The channel's id.
	* 		name (String): The name of the channel.
	* 		status (union): The status of the channel (public, private, protected).
	* 
	* Return (PageDto<Channel>): A PageDto of channels.
	* 
	* Notes:
	* 	I think it's the time,
	* 	To hold on rewind,
	* 	Tear this city down.
	**/
	

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getChannels(@Query() pageOptionsDto: PageOptionsDto,
		@Query() channelQueryFilterDto: ChannelQueryFilterDto,
		@Req() req): Promise<PageDto<Channel>>
	{
		return this.channelsService.getChannels(pageOptionsDto, channelQueryFilterDto, req.user);
	}

	/**
	* Create a channel.
	* 
	* Args:
	* 	PostChannelDto:
	* 		name (string): The name of the channel. Can only contain [ A-Za-z0-9_-!?'] (space included).
	* 
	* Return:
	* 	The object newly created.
	* 
	* Notes:
	* 	The channel is set as protected by default.
	**/
	
	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	createChannel(@Body() postChannelDto: PostChannelDto,
		@Req() req): Promise<Channel>
	{
		return this.channelsService.createChannel(postChannelDto, req.user);
	}

	/**
	* Create a channel.
	* 
	* Args:
	* 	PostChannelDto:
	* 		name (string): The name of the channel. Can only contain [ A-Za-z0-9_-!?'] (space included).
	* 
	* Return:
	* 	The object newly created.
	* 
	* Notes:
	* 	The channel is set as protected by default.
	**/

	@Patch('/:channel_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	updateChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Query() patchChannelDto: PatchChannelDto,
		@Req() req): Promise<Channel>
	{
		return this.channelsService.updateChannel(channel_id, patchChannelDto, req.user);
	}

	@Get('/:channel_id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getChannelUsers(@Query() pageOptionsDto: PageOptionsDto,
		@Query() userQueryFilterDto: UserQueryFilterDto,
		@Query() channelUserQueryFilterDto: ChannelUserQueryFilterDto,
		@Param('channel_id', ParseIntPipe) channel_id: number,
		@Req() req): Promise<PageDto<ChannelUser>>
	{
		return this.channelsService.getChannelUsers(pageOptionsDto, userQueryFilterDto, channelUserQueryFilterDto,
			channel_id, req.user);
	}

	@Post('/:channel_id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	joinChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Body() body: { password: string },
		@Req() req): Promise<Channel>
	{
		return this.channelsService.joinChannel(channel_id, req.user, body.password);
	}

	@Patch('/:channel_id/users/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	changeUserPermissions(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('user_id', ParseIntPipe) user_id: number,
		@Query() patchChannelUserDto: PatchChannelUserDto,
		@Req() req)
	{
		return this.channelsService.updateChannelUser(channel_id, user_id, req.user, patchChannelUserDto);
	}

	@Delete('/:channel_id/users/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	leaveChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.channelsService.deleteChannelUser(channel_id, user_id, req.user)
	}

	@Get('/:channel_id/messages')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getChannelMessages(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req)
	{
		return this.channelsService.getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto,
			userSelectDto, req.user);
	}

	@Get('/:channel_id/messages/as_sender')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getChannelMessagesAsSender(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query() messageQueryFilterDto: MessageQueryFilterDto,
		@Query() userSelectDto: UserSelectDto,
		@Req() req)
	{
		return this.channelsService.getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto,
			userSelectDto, req.user, true);
	}

	@Post('/:channel_id/messages')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	createChannelMessage(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Body() postMessageDto: PostMessageDto,
		@Req() req)
	{
		return this.channelsService.createChannelMessage(channel_id, postMessageDto, req.user);
	}

	@Patch('/:channel_id/messages/:message_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	updateChannelMessage(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('message_id', ParseIntPipe) message_id: number,
		@Query() updateMessageDto: UpdateMessageDto,
		@Req() req)
	{
		return this.channelsService.updateChannelMessage(channel_id, message_id, updateMessageDto, req.user)
	}
	
	@Delete('/:channel_id/messages/:message_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	deleteChannelMessage(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('message_id', ParseIntPipe) message_id: number,
		@Req() req)
	{
		return this.channelsService.deleteChannelMessage(channel_id, message_id, req.user)
	}

	@Get('/conversations')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getConversations(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.channelsService.getConversations(pageOptionsDto, req.user)
	}


	@Get('/:channel_id/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	getChannelBanlist(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query() channelBanQueryFilterDto: ChannelBanQueryFilterDto,)
	{
		return this.channelsService.getChannelBanlist(channel_id, pageOptionsDto, channelBanQueryFilterDto);
	}

	@Post('/:channel_id/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	banChannelUser(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Body() postChannelBanDto: PostChannelBanDto,
		@Req() req)
	{
		return this.channelsService.banChannelUser(channel_id, postChannelBanDto, req.user);
	}

	@Patch('/:channel_id/banlist/:ban_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	updateChannelBan(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('ban_id', ParseIntPipe) ban_id: number,
		@Query() updateChannelBanDto: UpdateChannelBanDto,
		@Req() req)
	{
		return this.channelsService.updateChannelBan(channel_id, ban_id, updateChannelBanDto, req.user);
	}

	@Delete('/:channel_id/banlist/:ban_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	unbanChannelUser(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('ban_id', ParseIntPipe) ban_id: number,
		@Req() req)
	{
		return this.channelsService.deleteChannelBan(channel_id, ban_id, req.user);
	}
}
