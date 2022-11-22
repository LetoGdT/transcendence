import {
	Controller, Req, Body, Get, Post, Patch, Delete,
	UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { PostChannelDto } from '../dto/channels.dto';

@Controller('channels')
export class ChannelsController
{
	constructor(private readonly channelsService: ChannelsService) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	getChannels()
	{
		return this.channelsService.getChannels();
	}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	createChannel(@Body() postChannelDto: PostChannelDto,
		@Req() req)
	{
		return this.channelsService.createChannel(postChannelDto, req.user);
	}

	@Patch('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	updateChannel()
	{

	}

	@Post('/users')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	joinChannel(@Body() id: number,
		@Req() req)
	{
		return this.channelsService.joinChannel(id, req.user);
	}

	@Patch('/users/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	changeUserPermissions()
	{

	}

	@Delete('/users/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	leaveChannel()
	{

	}
}
