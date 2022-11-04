import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";

// QueryFailedError UpdateValuesMissingError

@Injectable()
export class UsersService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	public async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder
			.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	// Get a user (using a general User dto)
	async getOneById(id: number): Promise<User>
	{
		return this.userRepository.findOne({ where: { id: id } });
	}

	async getOneByRefresh(refresh: string): Promise<User>
	{
		return this.userRepository.findOne({ where: { refresh_token: refresh } });
	}

	// Update a user
	async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult>
	{
		return await this.userRepository.update(id, updateUserDto);
	}

	// Create a user in the database
	async addUser(createUserDto: CreateUserDto): Promise<User>
	{
		const user = await this.userRepository.findOne({where: { uid: createUserDto.uid }});
		if (user)
			return user;
		const newUser: User = this.userRepository.create(createUserDto);
		return this.userRepository.save(newUser);
	}
}