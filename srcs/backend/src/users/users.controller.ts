import {
	Controller, Get, Post, Patch, Delete, Param, ParseIntPipe,
	NotFoundException, UseGuards, BadRequestException,
	UnauthorizedException, ClassSerializerInterceptor,
	UseInterceptors, Query, Req, UseFilters, Body, UploadedFile, Res,
	StreamableFile, Header, Response, ParseFilePipe, FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import * as fs from 'fs';
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
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getAllUsers(@Query() pageOptionsDto: PageOptionsDto,
		@Query() userQueryFilterDto: UserQueryFilterDto): Promise<PageDto<User>>
	{
		return this.usersService.getUsers(pageOptionsDto, userQueryFilterDto);
	}

	@Get('/isconnected')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	isConnected(@Req() req)
	{
		return req.user != null;
	}

	@Get('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	currentUser(@Req() req)
	{
		return req.user;
	}

	@Patch('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserFriends(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserFriends(pageOptionsDto, req.user);
	}

	@Post('/me/friends')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async createUserFriend(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.createUserFriend(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async deleteUserFriend(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.deleteUserFriend(req.user, user_id);
	}

	@Get('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserFriendInvitations(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserFriendInvitations(pageOptionsDto, req.user);
	}

	@Post('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async inviteUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.inviteUser(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/invites/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async declineInvitation(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.declineInvitation(req.user, user_id);
	}

	@Get('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserBanlist(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getUserBanlist(pageOptionsDto, req.user);
	}

	@Post('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async banUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req)
	{
		return this.usersService.banUser(createUserFriendDto, req.user);
	}

	@Delete('/me/banlist/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async unbanUser(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req)
	{
		return this.usersService.unbanUser(req.user, user_id);
	}

	@Get('/me/achievements')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getAchievements(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req)
	{
		return this.usersService.getAchievements(req.user, pageOptionsDto);
	}

	@Get('/me/matches')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserMatches(@Query() pageOptionsDto: PageOptionsDto,
		@Query() matchesQueryFilterDto: MatchesQueryFilterDto,
		@Req() req)
	{
		return this.matchesService.getAllMatches(pageOptionsDto, matchesQueryFilterDto, req.user.id);
	}

	@Get('/me/winrate')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserWinrate(@Req() req)
	{
		return this.matchesService.getWinrate(req.user.id);
	}

	@Post('/me/picture')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './src/static/uploads/',
			}),
		}),
	)
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async uploadImage(@UploadedFile(new ParseFilePipe({
		validators: [
			new FileTypeValidator({ fileType: 'image/*' }),
			],
	})) file: Express.Multer.File, @Req() req)
	{
		this.usersService.deleteOldPhoto(req.user, file.filename);
		return {
			filename: file.filename,
		};
	}
}





	// @Get('/photo')
	// @Header('Content-Type', 'image/jpeg')
	// getUserProfilePhoto(
	// 	@Res({ passthrough: true }) res: Response
	// ): StreamableFile {
	// 	const imageLocation = resolve(process.cwd(), 'src', 'static', 'uploads', '28bfbb3402a1c6fc1f6c451637466b60');
	// 	const file = fs.createReadStream(imageLocation);
	// 	return new StreamableFile(file);
	// }