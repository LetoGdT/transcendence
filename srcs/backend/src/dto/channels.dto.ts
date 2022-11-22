import { IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class PostChannelDto
{
	@IsNotEmpty()
	@MaxLength(20)
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	name: string;
}