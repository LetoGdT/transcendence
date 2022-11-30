import { Type } from "class-transformer";
import { IsInt, IsOptional, IsDate, Min, Max } from "class-validator";

export class ChannelBanQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	user_id: number;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	start_at: Date;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	end_at: Date;
}

export class PostChannelBanDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	user_id: number;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	unban_date: Date;
}

export class UpdateChannelBanDto
{
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	unban_date: Date;
}