import { Logger, Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/user.entity';
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

	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	public async getUsers(pageOptionsDto: PageOptionsDto,
		userQueryFilterDto: UserQueryFilterDto): Promise<PageDto<User>>
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
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
			.leftJoinAndSelect('user.following', 'following')
			.where('user.id = :id', { id: user.id })
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		console.log(entities);

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

		if (user == null)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		let toAddIndex: number = user.following.findIndex((users) => {
			return users.id == createUserFriendDto.id;
		});

		if (toAddIndex != -1)
			throw new BadRequestException('You are already friends');

		const queryBuilder2 = this.userRepository.createQueryBuilder('user');

		queryBuilder2
			.where('user.id = :id', { id: createUserFriendDto.id });

		const newFriend = await queryBuilder2.getOne();

		/**
		 * 
		 * Check if user has previously been invited.
		 * 
		 **/

		user.following.push(newFriend);
		user.followers.push(newFriend);
		return this.userRepository.save(user);
	}

	async deleteUserFriend(user: User)
	{

	}
}