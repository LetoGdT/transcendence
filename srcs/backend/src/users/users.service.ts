import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	// Return all users from the database
	async getAll(): Promise<User[]>
	{
		return this.userRepository.find();
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