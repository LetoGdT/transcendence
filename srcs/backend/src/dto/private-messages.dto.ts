import { Type } from 'class-transformer';
import { Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class PostPrivateDto
{
	@Type(() => Number)
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	recipient_id ?: number;

	recipient_name ?: string;

	@IsNotEmpty()
	content: string;
}

export class UpdateMessageDto
{
	@Type(() => String)
	@IsNotEmpty()
	content: string;
}