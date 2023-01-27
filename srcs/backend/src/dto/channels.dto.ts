import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength, Matches, IsOptional, IsAscii, IsIn, IsBoolean } from 'class-validator';

export class PostChannelDto
{
	@MinLength(3)
	@MaxLength(20)
	@Matches('^[ A-Za-z0-9_\\-!?\']*$')
	name: string;

	@IsOptional()
	@IsAscii()
	@MinLength(8)
	@MaxLength(40)
	password?: string;
}

export class PatchChannelDto
{
	@IsIn(['public', 'private', 'protected'])
	status: 'public' | 'private' | 'protected';

	@IsOptional()
	@IsAscii()
	@MinLength(8)
	@MaxLength(40)
	password: string;
}

export class PatchChannelUserDto
{
	@IsIn(['None', 'Admin', 'Owner'])
	@IsOptional()
	role: 'None' | 'Admin' | 'Owner';

	@IsBoolean()
	@IsOptional()
	is_muted: Boolean
}

export class PostChannelMessageDto
{
	@IsNotEmpty()
	content: string;
}