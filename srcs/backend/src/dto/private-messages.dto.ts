import { Type } from 'class-transformer';
import { Min, Max, IsNotEmpty } from 'class-validator';

export class PostPrivateDto
{
	@Type(() => Number)
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
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