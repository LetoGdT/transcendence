import { IsNotEmpty, MaxLength, MinLength, Matches, IsOptional, IsAscii } from 'class-validator';

export class PostChannelDto
{
	@MinLength(3)
	@MaxLength(20)
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	name: string;
}

export class PatchChannelDto
{
	status: 'public' | 'private' | 'protected';

	@IsOptional()
	@IsAscii()
	@MinLength(8)
	@MaxLength(40)
	password: string;
}