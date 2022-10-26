import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
import { CreateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async getAll(): Promise<User[]>
	{
		return this.userRepository.find();
	}

	async createUser(createUserDto: CreateUserDto)
	{
		const newUser = this.userRepository.create(createUserDto);
		return this.userRepository.save(newUser);
	}
}