import {
	Controller, Get, Post, Put, Param, ParseIntPipe, NotFoundException,
	BadRequestException, UnauthorizedException, ClassSerializerInterceptor, UseInterceptors, Query, Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { UpdateUserDto } from '../dto/users.dto';
import { AuthInterceptor } from '../auth/auth.interceptor'

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	@UseInterceptors(ClassSerializerInterceptor)
	async getAllUsers(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>
	{
		return this.usersService.getUsers(pageOptionsDto);
	}

	@Get('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	currentUser(@Req() req)
	{
		return req.user;
	}

	@Put('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async updateUser(@Query() updateUserDto: UpdateUserDto,
		@Req() req)
	{
		return await this.usersService.updateOne(req.user.id, updateUserDto);
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User>
	{
		try
		{
			var user: User = await this.usersService.getOneById(id);
		}
		catch (err)
		{
			console.log(err);
			throw new BadRequestException('An error occured');
		}
		if (user == null)
			throw new NotFoundException('User id was not found');
		return user;
	}
}

