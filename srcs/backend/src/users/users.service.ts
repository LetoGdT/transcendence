import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";

@Injectable()
export class UsersService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	// Return all users from the database
	getAll(): Promise<User[]>
	{
		return this.userRepository.find();
	}

	public async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>>
	{
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		queryBuilder.orderBy("user.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	// Get a user (using a general User dto)
	async getOneById(id: string): Promise<User>
	{
		return this.userRepository.findOne({ where: { id: id } });
	}

	async getOneByRefresh(refresh: string): Promise<User>
	{
		return this.userRepository.findOne({ where: { refresh_token: refresh } });
	}

	// Update a user
	async updateOne(id: number, updated): Promise<void>
	{
		this.userRepository.update(id, updated);
	}

	// Create a user in the database
	async addUser(createUserDto: CreateUserDto): Promise<User>
	{
		const user = await this.userRepository.findOne({where: { login: createUserDto.login }});
		if (user)
			return user;
		const newUser = this.userRepository.create(createUserDto);
		return this.userRepository.save(newUser);
	}
}