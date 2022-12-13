import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsNotEmpty } from "class-validator";

export class PostConversationDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	recipient_id: number;
}

export class PostConversationMessageDto
{
	@Type(() => String)
	@IsNotEmpty()
	content: string;
}

export class UpdateConversationMessageDto
{
	@Type(() => String)
	@IsNotEmpty()
	content: string;
}