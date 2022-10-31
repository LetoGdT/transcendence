import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto, ReturnUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	// Return all users from the database
	getAll(): Promise<User[]>
	{
		return this.userRepository.find();
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