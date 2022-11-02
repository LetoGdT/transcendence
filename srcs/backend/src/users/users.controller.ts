import {
	Controller, Get, Post, Param, ParseIntPipe, NotFoundException,
	BadRequestException, ClassSerializerInterceptor, UseInterceptors, Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async getAllUsers(): Promise<User[]>
	{
		let users = await this.usersService.getAll();
		return this.usersService.getAll();
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/all')
	async getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>
	{
		return this.usersService.getUsers(pageOptionsDto);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async getUserById(@Param('id', ParseIntPipe) id: string): Promise<User>
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
