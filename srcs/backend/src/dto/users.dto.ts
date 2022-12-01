import { Exclude } from 'class-transformer';

export class CreateUserDto
{
	uid: number;
	username: string;
	email: string;
	image_url: string;
}

export class UpdateUserDto
{
	username: string;
	email: string;
	image_url: string;

	@Exclude()
	refresh_token: string;

	@Exclude()
	refresh_expires: string;
}