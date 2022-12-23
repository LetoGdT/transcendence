import { Logger, Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateUserDto, UpdateUserDto, CreateUserFriendDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { UserQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";

// QueryFailedError UpdateValuesMissingError

@Injectable()
export class UsersService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
		private achievementsService: AchievementsService) {}

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
	async getOneById(id: number): Promise<User>
	{
		if (id == null)
			throw new HttpException('id is undefined', HttpStatus.INTERNAL_SERVER_ERROR);
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);
		return this.userRepository.findOne({ where: { id: id } });
	}

	async getOneByLogin(username: string): Promise<User>
	{
		if (username == null)
			throw new HttpException('username is undefined', HttpStatus.INTERNAL_SERVER_ERROR);
		return this.userRepository.findOne({ where: { username: username } });
	}

	async getOneByRefresh(refresh: string): Promise<User>
	{
		if (refresh == null)
			throw new HttpException('refresh is undefined', HttpStatus.INTERNAL_SERVER_ERROR);
		return this.userRepository.findOne({ where: { refresh_token: refresh } });
	}

	// Update a user
	async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult>
	{
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);
		return await this.userRepository.update(id, updateUserDto);
	}

	// Create a user in the database
	async addUser(createUserDto: CreateUserDto): Promise<User>
	{
		const user = await this.userRepository.findOne({ where: { uid: createUserDto.uid }});
		if (user)
			return user;
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
			throw new BadRequestException('You can\'t be friend with yourself. But love yourself.')

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.followers', 'followers')
			.leftJoinAndSelect('user.invited', 'invited')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		const toAddIndex: number = user.following.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toAddIndex != -1)
			throw new BadRequestException('You are already friends');

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.where('user.id = :id', { id: createUserFriendDto.id });

		const newFriend = await queryBuilder2.getOne();

		if (newFriend == null)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		const invitationIndex: number = user.invited.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (invitationIndex == -1)
			throw new BadRequestException('You were not invited by this user');

		user.invited.splice(invitationIndex, 1);
		user.following.push(newFriend);
		user.followers.push(newFriend);
		return this.userRepository.save(user);
	}

	async deleteUserFriend(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

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
			throw new BadRequestException('User is not in your friendlist');

		user.following.splice(toRemoveIndex, 1);
		user.followers.splice(toRemoveIndex, 1);
		return this.userRepository.save(user);
	}

	async getUserFriendInvitations(pageOptionsDto: PageOptionsDto,
		user: User)
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.leftJoin('user.invitations', 'invitations')
			.where('invitations.id = :id', { id: user.id })
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async inviteUser(user: User, createUserFriendDto: CreateUserFriendDto)
	{
		if (user.id == createUserFriendDto.id)
			throw new BadRequestException('You can\'t invite yourself.')

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.following', 'following')
			.leftJoinAndSelect('user.invitations', 'invitations')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		let checkIfFriend: number = user.following.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (checkIfFriend != -1)
			throw new BadRequestException('You are already friends!');

		let toAddIndex: number = user.invitations.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toAddIndex != -1)
			throw new BadRequestException('You can only send one invite at a time.');

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: createUserFriendDto.id });

		const user2 = await queryBuilder2.getOne();
		const checkBan: number = user2.banlist.findIndex((users) => {
			return users.id == user.id;
		});

		if (checkBan != -1)
			throw new HttpException('You have been blocked by this user', HttpStatus.FORBIDDEN)

		const newInvited = await queryBuilder2.getOne();

		if (newInvited == null)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		user.invitations.push(newInvited);
		return this.userRepository.save(user);
	}

	async declineInvitation(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder
			.leftJoinAndSelect('user.invited', 'invited')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder.getOne();

		const toRemoveIndex: number = user.invited.findIndex((users) => {
			return users.id == user_id;
		});

		if (toRemoveIndex == -1)
			throw new BadRequestException('User did not invite you');

		user.invited.splice(toRemoveIndex, 1);
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

		const retUser = await queryBuilder.getOne();

		return retUser.banlist;
	}

	async banUser(createUserFriendDto: CreateUserFriendDto, user: User)
	{
		if (user.id == createUserFriendDto.id)
			throw new BadRequestException('Do you really want to ban yourself ?!');

		const queryBuilder1 = this.userRepository.createQueryBuilder('user');

		queryBuilder1
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder1.getOne();

		const toBanIndex: number = user.banlist.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toBanIndex != -1)
			throw new BadRequestException('You already banned this user');

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.where('user.id = :id', { id: createUserFriendDto.id });

		const newBan = await queryBuilder2.getOne();

		if (newBan == null)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		user.banlist.push(newBan);
		return this.userRepository.save(user);
	}

	async unbanUser(user: User, user_id: number)
	{
		if (user_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		queryBuilder
			.leftJoinAndSelect('user.banlist', 'banlist')
			.where('user.id = :id', { id: user.id });

		user = await queryBuilder.getOne();

		const toRemoveIndex: number = user.banlist.findIndex((users) => {
			return users.id == user_id;
		});

		if (toRemoveIndex == -1)
			throw new BadRequestException('User is not in your banlist');

		user.banlist.splice(toRemoveIndex, 1);
		return this.userRepository.save(user);
	}

	async getAchievements(user: User, pageOptionsDto: PageOptionsDto)
	{
		return this.achievementsService.getUserAchievements(pageOptionsDto, user);
	}

	async changeRank(user: User, new_rank: number)
	{
		user.exp = new_rank;
		this.userRepository.save(user);
	}
}