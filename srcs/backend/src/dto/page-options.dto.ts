import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum Order
{
	ASC = "ASC",
	DESC = "DESC",
}

/**
* Description:
* 	The dto used to paginate queries. This is implemented on most (if not all)
* 	get requests, to limit the load on the database and avoid timeouts on queries.
* 
* members:
* 	order (Order): Choose ascending or descending order.
* 	page (Number): Select the page of data to return (number of items
* 	depends on take).
* 	take (Number): Select the number of elements returned by page.
* 
* Notes:
* 	Ruled by secrecy.
**/


export class PageOptionsDto
{
	@IsEnum(Order)
	@IsOptional()
	order: Order = Order.ASC;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(Number.MAX_SAFE_INTEGER)
	@IsOptional()
	page: number = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	take: number = 5;

	get skip(): number
	{
		return (this.page - 1) * this.take;
	}
}