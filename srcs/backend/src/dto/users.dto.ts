import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateUserDto
{
	@Type(() => Number)
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
	@IsOptional()
	username: string;

	@IsNotEmpty()
	@IsOptional()
	image_url: string;
}

export class CreateUserFriendDto
{
	@Type(() => Number)
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsNotEmpty()
	id: number;
}