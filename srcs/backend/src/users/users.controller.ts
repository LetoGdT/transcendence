import {
	Controller, Get, Post, Patch, Delete, Param, ParseIntPipe,
	NotFoundException, UseGuards, BadRequestException,
	UnauthorizedException, ClassSerializerInterceptor,
	UseInterceptors, Query, Req, UseFilters, Body
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { UpdateUserDto, CreateUserFriendDto } from '../dto/users.dto';
import { UserQueryFilterDto } from '../dto/query-filters.dto';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RedirectToLoginFilter } from '../filters/auth-exceptions.filter';

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseFilters(RedirectToLoginFilter)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getAllUsers(@Query() pageOptionsDto: PageOptionsDto,
		@Query() userQueryFilterDto: UserQueryFilterDto): Promise<PageDto<User>>
	{
		return this.usersService.getUsers(pageOptionsDto, userQueryFilterDto);
	}

	@Get('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	currentUser(@Req() req)
	{
		return req.user;
	}

	@Patch('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async updateUser(@Query() updateUserDto: UpdateUserDto,
		@Req() req)
	{
		if (Object.keys(updateUserDto).length === 0)
			throw new BadRequestException('Empty parameters');
		return await this.usersService.updateOne(req.user.id, updateUserDto);
	}

	@Get('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User>
	{
		var user: User = await this.usersService.getOneById(id);
		if (user == null)
			throw new NotFoundException('User id was not found');
		return user;
	}

	@Get('/me/friends')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserFriends(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserFriends(pageOptionsDto, req.user);
	}

	@Post('/me/friends')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async createUserFriend(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.createUserFriend(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async deleteUserFriend()
	{

	}

}

