import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsNotEmpty, MaxLength } from "class-validator";

export class PostConversationDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	recipient_id: number;
}

export class UpdateConversationMessageDto
{
	@Type(() => String)
	@IsNotEmpty()
	@MaxLength(500)
	content: string;
}