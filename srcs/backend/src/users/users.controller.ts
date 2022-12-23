import {
	Controller, Get, Post, Patch, Delete, Param, ParseIntPipe,
	NotFoundException, UseGuards, BadRequestException,
	UnauthorizedException, ClassSerializerInterceptor,
	UseInterceptors, Query, Req, UseFilters, Body
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MatchesService } from '../matches/matches.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { UpdateUserDto, CreateUserFriendDto } from '../dto/users.dto';
import { UserQueryFilterDto, MatchesQueryFilterDto } from '../dto/query-filters.dto';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RedirectToLoginFilter } from '../filters/auth-exceptions.filter';

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService,
		private readonly matchesService: MatchesService) {}

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

	@Get('/isconnected')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	isConnected(@Req() req)
	{
		return req.user != null;
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

	@Delete('/me/friends/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async deleteUserFriend(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.deleteUserFriend(req.user, user_id);
	}

	@Get('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserFriendInvitations(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserFriendInvitations(pageOptionsDto, req.user);
	}

	@Post('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async inviteUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.inviteUser(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/invites/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async declineInvitation(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.declineInvitation(req.user, user_id);
	}

	@Get('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserBanlist(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserBanlist(pageOptionsDto, req.user);
	}

	@Post('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async banUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.banUser(createUserFriendDto, req.user);
	}

	@Delete('/me/banlist/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async unbanUser(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.unbanUser(req.user, user_id);
	}

	@Get('/me/achievements')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getAchievements(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getAchievements(req.user, pageOptionsDto);
	}

	@Get('/me/matches')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserMatches(@Query() pageOptionsDto: PageOptionsDto,
		@Query() matchesQueryFilterDto: MatchesQueryFilterDto,
		@Req() req)
	{
		return this.matchesService.getAllMatches(pageOptionsDto, matchesQueryFilterDto, req.user.id);
	}

	@Get('/me/winrate')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async getUserWinrate(@Req() req)
	{
		return this.matchesService.getWinrate(req.user.id);
	}
}