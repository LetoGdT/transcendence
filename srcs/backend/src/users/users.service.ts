import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { UserQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";

// QueryFailedError UpdateValuesMissingError

@Injectable()
export class UsersService
{
	IdMax: number = 1000000000000;

	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	public async getUsers(pageOptionsDto: PageOptionsDto,
		userQueryFilterDto: UserQueryFilterDto): Promise<PageDto<User>>
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.where(pageOptionsDto['id'] != null
				? 'user.id = :id'
				: 'TRUE', { id: userQueryFilterDto.id })
			.andWhere(pageOptionsDto['uid'] != null
				? 'user.uid = :uid'
				: 'TRUE', { uid: userQueryFilterDto.uid })
			.andWhere(pageOptionsDto['username'] != null
				? 'user.username LIKE :username'
				: 'TRUE', { username: userQueryFilterDto.username })
			.andWhere(pageOptionsDto['email'] != null
				? 'user.email LIKE :email'
				: 'TRUE', { email: userQueryFilterDto.email })
			.andWhere(pageOptionsDto['image_url'] != null
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
		if (id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);
		return this.userRepository.findOne({ where: { id: id } });
	}

	// Don't use, it has security vulnerability
	async getOneByLogin(username: string)
	{
		return this.userRepository.findOne({ where: { username: username } });
	}

	async getOneByRefresh(refresh: string): Promise<User>
	{
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
}