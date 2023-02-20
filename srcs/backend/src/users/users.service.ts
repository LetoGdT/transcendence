import { Logger, Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from "@nestjs/axios";
import { Repository, UpdateResult } from 'typeorm';
import * as fs from 'fs';
import * as mmm from 'mmmagic';
import { User } from '../typeorm/user.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateUserDto, UpdateUserDto, CreateUserFriendDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { UserQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";

@Injectable()
export class UsersService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
		private achievementsService: AchievementsService,
		private readonly http: HttpService,
		private readonly configService: ConfigService) {}

	public async getUsers(pageOptionsDto: PageOptionsDto,
		userQueryFilterDto: UserQueryFilterDto): Promise<PageDto<User>>
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoinAndSelect('user.invitations', 'invitations')
			.leftJoinAndSelect('user.invited', 'invited')
			.where(userQueryFilterDto.id != null
				? 'user.id = :id'
				: 'TRUE', { id: userQueryFilterDto.id })
			.andWhere(userQueryFilterDto.uid != null
				? 'user.uid = :uid'
				: 'TRUE', { uid: userQueryFilterDto.uid })
			.andWhere(userQueryFilterDto.username != null
				? 'user.username LIKE :username'
				: 'TRUE', { username: userQueryFilterDto.username })
			.andWhere(userQueryFilterDto.email != null
				? 'user.email LIKE :email'
				: 'TRUE', { email: userQueryFilterDto.email })
			.andWhere(userQueryFilterDto.image_url != null
				? 'user.image_url LIKE :image_url'
				: 'TRUE', { image_url: userQueryFilterDto.image_url })
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	// Get a user (using a general User dto)
	// IMPORTANT: NEVER use when id might be undefined, or it returns the first
	// user of the db
	async getOneById(id: number): Promise<User | null>
	{
		if (id == null)
			throw new HttpException(['id is undefined'], HttpStatus.INTERNAL_SERVER_ERROR);
		if (id > this.IdMax)
			throw new BadRequestException([`id must not be greater than ${this.IdMax}`]);
		return this.userRepository.findOne({ where: { id: id } });
	}

	async getOneByRefresh(refresh: string): Promise<User | null>
	{
		if (refresh == null)
			throw new HttpException(['refresh is undefined'], HttpStatus.INTERNAL_SERVER_ERROR);
		return this.userRepository.findOne({ where: { refresh_token: refresh } });
	}

	// Update a user
	async updateOnePartial(user: User, updateUserDto: UpdateUserDto): Promise<User>
	{
		const dup: User | null = await this.userRepository.findOne({
			where: { username: updateUserDto.username }
		});
		if (updateUserDto.username != null && dup != null)
			throw new BadRequestException(['Username already exists']);

		if (updateUserDto.username != null)
			user.username = updateUserDto.username;

		if (updateUserDto.image_url != null)
		{
			let response;
			try
			{
				response = await this.http.axiosRef({
					url: updateUserDto.image_url,
					method: 'GET',
					responseType: 'arraybuffer'
				});
			}
			catch (err) { throw new BadRequestException(['Invalid url']) }
			const type = await this.mimeFromBuffer(response.data);
			if (typeof type === "string" && type.split('/')[0] !== 'image')
				throw new BadRequestException(['Invalid file; expected an image']);
			let oldPath;
			let toDelete: boolean = true;
			try
			{
				oldPath = './src/static' + (new URL(user.image_url)).pathname;
			}
			catch (err) { toDelete = false }
			if (toDelete && fs.existsSync(oldPath))
			{
				fs.unlink(oldPath, (err) => {
					if (err)
						throw new HttpException(['There was an error deleting the previous file'],
							HttpStatus.INTERNAL_SERVER_ERROR)
				});
			}
			user.image_url = updateUserDto.image_url;
		}
		return this.userRepository.save(user);
	}

	updateOne(user: User)
	{
		return this.userRepository.save(user);
	}

	// Create a user in the database
	async addUser(createUserDto: CreateUserDto): Promise<User>
	{
		const user = await this.userRepository.findOne({ where: { uid: createUserDto.uid }});
		if (user)
			return user;
		const userTestUsername = await this.userRepository.findOne({ where: { username: createUserDto.username }});
		if (userTestUsername != null)
			createUserDto.username += "2";
		const newUser: User = this.userRepository.create(createUserDto);
		return this.userRepository.save(newUser);
	}

	async getUserFriends(pageOptionsDto: PageOptionsDto,
		user: User)
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoin('user.following', 'follow')
			.where('follow.id = :id', { id: user.id })
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createUserFriend(user: User, createUserFriendDto: CreateUserFriendDto)
	{
		if (user.id == createUserFriendDto.id)
			throw new BadRequestException(['You can\'t be friend with yourself. But love yourself.']);

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.followers', 'followers')
			.leftJoinAndSelect('user.invitations', 'invitations')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		const toAddIndex: number = user.following.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toAddIndex != -1)
			throw new BadRequestException(['You are already friends']);

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.where('user.id = :id', { id: createUserFriendDto.id });

		const newFriend = await queryBuilder2.getOne();

		if (newFriend == null)
			throw new HttpException(['User not found'], HttpStatus.NOT_FOUND);

		const invitationIndex: number = user.invitations.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (invitationIndex === -1)
			throw new BadRequestException(['You were not invited by this user']);

		user.invitations.splice(invitationIndex, 1);
		user.following.push(newFriend);
		user.followers.push(newFriend);
		return this.userRepository.save(user);
	}

	async deleteUserFriend(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException([`id must not be greater than ${this.IdMax}`]);

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder
			.leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.followers', 'followers')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder.getOne();

		const toRemoveIndex: number = user.following.findIndex((users) => {
			return users.id == user_id;
		});

		if (toRemoveIndex == -1)
			throw new BadRequestException(['User is not in your friendlist']);

		user.following.splice(toRemoveIndex, 1);
		user.followers.splice(toRemoveIndex, 1);
		return this.userRepository.save(user);
	}

	async getUserFriendInvitations(user: User)
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoinAndSelect('user.invitations', 'invitations')
			.where('user.id = :id', { id: user.id })

		const ret = await queryBuilder.getOne();
		return ret.invitations;
	}

	async inviteUser(user: User, createUserFriendDto: CreateUserFriendDto)
	{
		if (user.id == createUserFriendDto.id)
			throw new BadRequestException(['You can\'t invite yourself.']);

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.invited', 'invited')
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		let checkIfFriend: number = user.following.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (checkIfFriend !== -1)
			throw new BadRequestException(['You are already friends!']);

		let toAddIndex: number = user.invited.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toAddIndex !== -1)
			throw new BadRequestException(['You can only send one invite at a time.']);

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: createUserFriendDto.id });

		const user2: User | null = await queryBuilder2.getOne();

		if (user2 == null)
			throw new HttpException(["An unexpected error occured: invalid id"],
				HttpStatus.INTERNAL_SERVER_ERROR);

		let checkBan: number = user2.banlist.findIndex((users) => {
			return users.id == user.id;
		});

		if (checkBan != -1)
			throw new HttpException(['You have been blocked by this user'], HttpStatus.FORBIDDEN);

		checkBan = user.banlist.findIndex((users) => {
			return users.id == user2.id
		})

		if (checkBan != -1)
			throw new HttpException(['You blocked this user'], HttpStatus.FORBIDDEN);

		const newInvited = await queryBuilder2.getOne();

		if (newInvited == null)
			throw new HttpException(['User not found'], HttpStatus.NOT_FOUND);

		user.invited.push(newInvited);
		return this.userRepository.save(user);
	}

	async declineInvitation(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException([`id must not be greater than ${this.IdMax}`]);

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder
			.leftJoinAndSelect('user.invitations', 'invitations')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder.getOne();

		const toRemoveIndex: number = user.invitations.findIndex((users) => {
			return users.id == user_id;
		});

		if (toRemoveIndex == -1)
			throw new BadRequestException(['User did not invite you']);

		user.invitations.splice(toRemoveIndex, 1);
		return this.userRepository.save(user);
	}

	async getUserBanlist(pageOptionsDto: PageOptionsDto, user: User)
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: user.id })
			.select(['user.id', 'banlist'])
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const retUser: User | null = await queryBuilder.getOne();

		if (retUser == null)
			throw new BadRequestException(["User doesn\'t exist"]);

		return retUser.banlist;
	}

	async banUser(createUserFriendDto: CreateUserFriendDto, user: User)
	{
		if (user.id == createUserFriendDto.id)
			throw new BadRequestException(['Do you really want to ban yourself ?!']);

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.banlist', 'banlist')
			.leftJoinAndSelect('user.followers', 'followers')
			.leftJoinAndSelect('user.invited', 'invited')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		const toBanIndex: number = user.banlist.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toBanIndex != -1)
			throw new BadRequestException(['You already banned this user']);

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.where('user.id = :id', { id: createUserFriendDto.id })
			// .leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.followers', 'followers')
			.leftJoinAndSelect('user.invitations', 'invitations');

		const newBan: User | null = await queryBuilder2.getOne();

		if (newBan == null)
			throw new HttpException(["An unexpected error occured: invalid id"],
				HttpStatus.INTERNAL_SERVER_ERROR);

		user.banlist.push(newBan);
		const friendIndex: number = user.followers.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});
		if (friendIndex !== -1)
		{
			user.followers.splice(friendIndex, 1);
			const followersIndex: number = newBan.followers.findIndex((users) => {
				return users.id == createUserFriendDto.id;
			});
			newBan.followers.splice(followersIndex, 1);
		}
		const invitedIndex: number = user.invited.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		})
		if (invitedIndex !== -1)
		{
			user.invited.splice(invitedIndex, 1);
			const invitationIndex: number = newBan.invitations.findIndex((users) => {
				return users.id == createUserFriendDto.id;
			});
			newBan.invitations.splice(invitationIndex, 1);
		}
		await this.userRepository.save(newBan);
		return this.userRepository.save(user);
	}

	async unbanUser(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException([`id must not be greater than ${this.IdMax}`]);

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder.getOne();

		const toRemoveIndex: number = user.banlist.findIndex((users) => {
			return users.id == user_id;
		});

		if (toRemoveIndex == -1)
			throw new BadRequestException(['User is not in your banlist']);

		user.banlist.splice(toRemoveIndex, 1);
		return this.userRepository.save(user);
	}

	async getChannels(user: User)
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoinAndSelect('user.channelUsers', 'channelUsers')
			.leftJoinAndSelect('channelUsers.channel', 'channel')
			.where('user.id = :id', { id: user.id });

		const ret = await queryBuilder.getOne();
		return ret.channelUsers.map((channelUser: ChannelUser) => {return channelUser.channel});
	}

	async getAchievements(id: number, pageOptionsDto: PageOptionsDto)
	{
		if (id > this.IdMax)
			throw new BadRequestException([`id must not be greater than ${this.IdMax}`]);
		return this.achievementsService.getUserAchievements(pageOptionsDto, id);
	}

	async changeRank(user: User, new_rank: number)
	{
		user.exp = new_rank;
		return this.userRepository.save(user);
	}

	async deleteOldPhoto(user: User, filename: string): Promise<void>
	{
		let oldPath;
		try
		{
			oldPath = './src/static' + (new URL(user.image_url)).pathname;
		}
		catch (err) {}
		if (fs.existsSync(oldPath))
		{
			fs.unlink(oldPath, (err) => {
				if (err)
					throw new HttpException(['There was an error deleting the previous file'],
						HttpStatus.INTERNAL_SERVER_ERROR)
			});
		}
		user.image_url = `${this.configService.get<string>('REACT_APP_NESTJS_HOSTNAME')}/uploads/${filename}`;
		this.userRepository.save(user);
	}

	async enable2fa(user: User): Promise<User>
	{
		user.enabled2fa = true;
		return this.userRepository.save(user);
	}

	async disable2fa(user: User): Promise<User>
	{
		user.enabled2fa = false;
		return this.userRepository.save(user);
	}

	async changeUserStatus(id: number, status: 'online' | 'offline' | 'in-game')
	{
		const user = await this.userRepository.findOne({ where: { id: id }});
		user.status = status;
		return this.userRepository.save(user);
	}

	async mimeFromData(path: string)
	{
		let magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
		return new Promise((resolve, reject) =>
			magic.detectFile(path, (error, mimeType) => {
				return resolve(mimeType);
			})
		);
	}

	async mimeFromBuffer(buffer: Buffer)
	{
		let magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
		return new Promise((resolve, reject) =>
			magic.detect(buffer, (error, mimeType) => {
				return resolve(mimeType);
			})
		);
	}
}