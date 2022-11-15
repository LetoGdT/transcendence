import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UserSelectDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(1000000000000)
	@IsOptional()
	sender_id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(1000000000000)
	@IsOptional()
	recipient_id: number;
}