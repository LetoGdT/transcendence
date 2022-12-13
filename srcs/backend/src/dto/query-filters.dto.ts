import { Type } from "class-transformer";
import {
	IsInt, IsOptional, IsDate, Min, Max, ValidateNested, MinLength, MaxLength, Matches, IsIn, IsNotEmpty
} from "class-validator";
import { User } from '../typeorm/user.entity';

export class UserQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	uid: number;

	@IsOptional()
	username: string;

	@IsOptional()
	email: string;

	@IsOptional()
	image_url: string;
}

export class MessageQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	message_id?: number;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	start_at: Date;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	end_at: Date;
}

export class ChannelQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	id: number;

	@IsOptional()
	@MinLength(3)
	@MaxLength(20)
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	name: string;

	@IsOptional()
	@IsIn(['public', 'private', 'protected'])
	status: 'public' | 'private' | 'protected';
}

export class ChannelUserQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	id: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	user_id: number;

	@IsIn(['Owner', 'Admin', 'None'])
	@IsNotEmpty()
	@IsOptional()
	role: 'Owner' | 'Admin' | 'None';
}

export class ConversationQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	user2_id: number;
}