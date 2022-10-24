import
{
	Controller, Get, Post, Query, Req,
	Logger, Body, HttpStatus, HttpException
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express'

@Controller()
export class AppController
{
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(@Query() query: { plain: string, pass: string },
		@Req() request: Request): string
	{
		if ( request.cookies && 'auth_cookie' in request.cookies && request.cookies.auth_cookie.length > 0)
			return "You are logged in";
		return "You are not logged in";
	}

	// @Post()
	// getNameList(@Body() message: string)
	// {
	// 	this.logger.log(message);
	// 	return message;
	// }
}
