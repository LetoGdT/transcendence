import { Exclude } from 'class-transformer';
import { IsNotEmpty, Min, Max } from 'class-validator';

export class CreateUserDto
{
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
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

export class CreateUserFriendDto
{
	// @Min(1)
	// @Max(Number.MAX_SAFE_INTEGER)
	id: number;
}