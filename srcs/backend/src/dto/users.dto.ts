import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto
{
	uid: number;

	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	image_url: string;
}

export class UpdateUserDto
{
	@IsNotEmpty()
	username: string;
	
	@IsNotEmpty()
	email: string;
	
	@IsNotEmpty()
	image_url: string;

	@Exclude()
	@IsNotEmpty()
	refresh_token: string;

	@Exclude()
	@IsNotEmpty()
	refresh_expires: string;
}