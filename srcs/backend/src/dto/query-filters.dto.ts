import { Type } from "class-transformer";
import { IsInt, IsOptional, IsDate, Min, ValidateNested } from "class-validator";
import { User } from '../typeorm/user.entity';

export class UserQueryFilterDto
{
	@Type(() => Number)
	@IsInt()
	@Min(1)
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
	@IsOptional()
	id: number;

	@ValidateNested()
	@IsOptional()
	sender: User

	@ValidateNested()
	@IsOptional()
	recipient: User

	@IsDate()
	@IsOptional()
	sent_date: string;

	@IsDate()
	@IsOptional()
	received_date: string;

}