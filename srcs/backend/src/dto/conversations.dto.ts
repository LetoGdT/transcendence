import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PostConversationDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	recipient_id: number;
}