import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UserSelectDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(9223372036854775807)
	@IsOptional()
	sender_id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(9223372036854775807)
	@IsOptional()
	recipient_id: number;
}