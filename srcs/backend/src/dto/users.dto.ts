import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, Min, Max, IsOptional, Matches, MinLength, MaxLength } from 'class-validator';

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
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	@MinLength(3)
	@MaxLength(20)
	username: string;

	@IsNotEmpty()
	@IsOptional()
	@MaxLength(2000)
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