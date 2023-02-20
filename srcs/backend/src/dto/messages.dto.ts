import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsNotEmpty, MaxLength } from "class-validator";

export class UserSelectDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	sender_id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	recipient_id: number;
}

export class PostMessageDto
{
	@IsNotEmpty()
	@MaxLength(500)
	content: string;
}

export class UpdateMessageDto
{
	@Type(() => String)
	@IsNotEmpty()
	@MaxLength(500)
	content: string;
}