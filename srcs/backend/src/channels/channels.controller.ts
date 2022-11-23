import {
	Controller, Req, Body, Get, Post, Patch, Delete,
	UseInterceptors, ClassSerializerInterceptor,
	Param, ParseIntPipe, Query
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Channel } from '../typeorm/channel.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostChannelDto } from '../dto/channels.dto';
import { PatchChannelDto } from '../dto/channels.dto';

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
		@Req() req)
	{
		return this.channelsService.createChannel(postChannelDto, req.user);
	}

	@Get('/:id/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelbanlist()
	{
		
	}

	@Patch('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	updateChannel(@Param('id', ParseIntPipe) id: number,
		@Query() patchChannelDto: PatchChannelDto,
		@Req() req)
	{
		return this.channelsService.updateChannel(id, patchChannelDto, req.user)
	}

	@Get('/:id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannelUsers(@Query() pageOptionsDto: PageOptionsDto,
		@Param('id', ParseIntPipe) id: number,
		@Req() req)
	{
		return this.channelsService.getChannelUsers(pageOptionsDto, id, req.user)
	}

	@Post('/:id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	joinChannel(@Param('id', ParseIntPipe) id: number,
		@Req() req)
	{
		return this.channelsService.joinChannel(id, req.user);
	}

	@Patch('/:id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	changeUserPermissions()
	{

	}

	@Delete('/:id/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	leaveChannel()
	{

	}
}
