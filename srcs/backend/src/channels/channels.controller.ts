import {
	Controller, Req, Body, Get, Post, Patch, Delete,
	UseInterceptors, ClassSerializerInterceptor,
	Param, ParseIntPipe, Query
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Channel } from '../typeorm/channel.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostChannelDto, PatchChannelDto, PatchChannelUserDto } from '../dto/channels.dto';

@Controller('channels')
export class ChannelsController
{
	constructor(private readonly channelsService: ChannelsService) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannels(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req): Promise<PageDto<Channel>>
	{
		return this.channelsService.getChannels(pageOptionsDto, req.user);
	}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	createChannel(@Body() postChannelDto: PostChannelDto,
		@Req() req): Promise<Channel>
	{
		return this.channelsService.createChannel(postChannelDto, req.user);
	}

	@Patch('/:channel_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	updateChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Query() patchChannelDto: PatchChannelDto,
		@Req() req): Promise<Channel>
	{
		return this.channelsService.updateChannel(channel_id, patchChannelDto, req.user)
	}

	@Get('/:channel_id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelUsers(@Query() pageOptionsDto: PageOptionsDto,
		@Param('channel_id', ParseIntPipe) channel_id: number,
		@Req() req): Promise<PageDto<ChannelUser>>
	{
		return this.channelsService.getChannelUsers(pageOptionsDto, channel_id, req.user)
	}

	@Post('/:channel_id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	joinChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Body() body: { password: string },
		@Req() req): Promise<Channel>
	{
		return this.channelsService.joinChannel(channel_id, req.user, body.password);
	}

	@Patch('/:channel_id/users/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	changeUserPermissions(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('user_id', ParseIntPipe) user_id: number,
		@Query() patchChannelUserDto: PatchChannelUserDto,
		@Req() req)
	{
		return this.channelsService.updateChannelUser(channel_id, user_id, req.user, patchChannelUserDto.role);
	}

	@Delete('/:channel_id/users/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	leaveChannel(@Param('channel_id', ParseIntPipe) channel_id: number,
		@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.channelsService.deleteChannelUser(channel_id, user_id, req.user)
	}

	@Get('/:channel_id/messages')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelMessages()
	{

	}

	@Get('/:channel_id/messages/as_sender')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelMessagesAsSender()
	{

	}

	@Get('/:channel_id/messages/as_recipient')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelMessagesAsRecipient()
	{

	}

	@Post('/:channel_id/messages')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	createChannelMessage()
	{

	}

	@Patch('/:channel_id/messages/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	updateChannelMessage()
	{

	}
	
	@Delete('/:channel_id/messages/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	deleteChannelMessage()
	{

	}

	@Get('/conversations')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getConversations()
	{

	}


	@Get('/:channel_id/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelbanlist()
	{
		
	}
}
