import {
	Controller, Get, Post, Patch, Delete, Param, ParseIntPipe,
	NotFoundException, UseGuards, BadRequestException,
	UnauthorizedException, ClassSerializerInterceptor,
	UseInterceptors, Query, Req, UseFilters, Body, UploadedFile, Res,
	StreamableFile, Header, Response, ParseFilePipe, FileTypeValidator,
	SerializeOptions, HttpStatus, HttpException, MaxFileSizeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import * as fs from 'fs';
import * as mmm from 'mmmagic';
import { UsersService } from './users.service';
import { MatchesService } from '../matches/matches.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { UpdateUserDto, CreateUserFriendDto } from '../dto/users.dto';
import { UserQueryFilterDto, MatchesQueryFilterDto } from '../dto/query-filters.dto';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RedirectToLoginFilter } from '../filters/auth-exceptions.filter';
import { RequestWithUser } from '../interfaces/RequestWithUser.interface';

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService,
		private readonly matchesService: MatchesService,
		private readonly authService: AuthService) {}

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
	@UseGuards(JwtAuthGuard)
	async isConnected() {}

	@Get('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	@SerializeOptions({
		groups: ['me'],
	})
	currentUser(@Req() req: RequestWithUser)
	{
		return req.user;
	}

	@Patch('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	@SerializeOptions({
		groups: ['me'],
	})
	async updateUser(@Body() updateUserDto: UpdateUserDto,
		@Req() req: RequestWithUser)
	{
		if (Object.keys(updateUserDto).length === 0)
			throw new BadRequestException('Empty parameters');
		return this.usersService.updateOnePartial(req.user, updateUserDto);
	}

	@Get('/:id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User>
	{
		const user: User | null = await this.usersService.getOneById(id);
		if (user == null)
			throw new NotFoundException('User id was not found');
		return user;
	}

	@Get('/me/friends')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	@SerializeOptions({
		groups: ['friends'],
	})
	async getUserFriends(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.getUserFriends(pageOptionsDto, req.user);
	}

	@Post('/me/friends')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	@SerializeOptions({
		groups: ['friends'],
	})
	async createUserFriend(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.createUserFriend(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	@SerializeOptions({
		groups: ['friends'],
	})
	async deleteUserFriend(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req: RequestWithUser)
	{
		return this.usersService.deleteUserFriend(req.user, user_id);
	}

	@Get('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserFriendInvitations(@Req() req: RequestWithUser)
	{
		return this.usersService.getUserFriendInvitations(req.user);
	}

	@Post('/me/friends/invites')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async inviteUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.inviteUser(req.user, createUserFriendDto);
	}

	@Delete('/me/friends/invites/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async declineInvitation(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req: RequestWithUser)
	{
		return this.usersService.declineInvitation(req.user, user_id);
	}

	@Get('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserBanlist(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.getUserBanlist(pageOptionsDto, req.user);
	}

	@Post('/me/banlist')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async banUser(@Body() createUserFriendDto: CreateUserFriendDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.banUser(createUserFriendDto, req.user);
	}

	@Delete('/me/banlist/:user_id')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async unbanUser(@Param('user_id', ParseIntPipe) user_id: number,
		@Req() req: RequestWithUser)
	{
		return this.usersService.unbanUser(req.user, user_id);
	}

	@Get('/me/achievements')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getAchievements(@Query() pageOptionsDto: PageOptionsDto,
		@Req() req: RequestWithUser)
	{
		return this.usersService.getAchievements(req.user.id, pageOptionsDto);
	}

	@Get('/me/channels')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getChannels(@Req() req: RequestWithUser)
	{
		return this.usersService.getChannels(req.user);
	}
	

	@Get('/:id/achievements')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	async getUserAchievements(@Param('id', ParseIntPipe) id: number,
		@Query() pageOptionsDto: PageOptionsDto)
	{
		return this.usersService.getAchievements(id, pageOptionsDto);
	}

	@Get('/me/matches')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserMatches(@Query() pageOptionsDto: PageOptionsDto,
		@Query() matchesQueryFilterDto: MatchesQueryFilterDto,
		@Req() req: RequestWithUser)
	{
		return this.matchesService.getAllMatches(pageOptionsDto, matchesQueryFilterDto, req.user.id);
	}

	@Get('/me/winrate')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async getUserWinrate(@Req() req: RequestWithUser)
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
			new MaxFileSizeValidator({ maxSize: 1000 }),
			new FileTypeValidator({ fileType: 'image/*' }),
			],
	})) file: Express.Multer.File, @Req() req: RequestWithUser)
	{
		const type = await this.usersService.mimeFromData(file.path);
		if (typeof type === "string" && type.split('/')[0] !== 'image')
		{
			fs.unlink(file.path, (err) => {
				if (err)
					throw new HttpException('There was an error deleting the file',
						HttpStatus.INTERNAL_SERVER_ERROR);
			});
			throw new BadRequestException('Invalid file; expected an image');
		}
		
		this.usersService.deleteOldPhoto(req.user, file.filename);

		return {
			filename: file.filename,
		};
	}
}