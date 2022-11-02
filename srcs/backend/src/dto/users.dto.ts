import { Expose, Exclude } from 'class-transformer';

export class CreateUserDto
{
	login: string;
	email: string;
	image_url: string;
}

@Expose()
export class UpdateUserDto
{
	login: string;
	email: string;
	image_url: string;

	@Exclude()
	refresh_token: string;

	@Exclude()
	refresh_expires: string;
}