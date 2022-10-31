import { Controller, Get, Post, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReturnUserDto } from '../dto/users.dto';

@Controller('users')
export class UsersController
{
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getAllUsers(): Promise<ReturnUserDto[]>
	{
		let users: ReturnUserDto[] = await this.usersService.getAll();

		// Remove anything associated with the user's refresh token.
		return users.map(({ id, login, email, image_url }) => ({ id, login, email, image_url }));
	}

	@Get(':id')
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<ReturnUserDto>
	{
		try
		{
			var user: ReturnUserDto = await this.usersService.getOneById(id);
		}

		catch (err)
		{
			console.log(err);
			throw new BadRequestException('Number too large');
		}
		if (user == null)
			throw new NotFoundException('User id was not found');
		return { id: user.id, login: user.login, email: user.email, image_url: user.image_url }
	}
}
