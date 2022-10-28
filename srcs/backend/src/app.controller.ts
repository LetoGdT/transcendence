import
{
	Controller, Get, Post, Query, Req, Headers,
	Logger, Body, HttpStatus, HttpException, UseGuards, UseFilters
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'
import { AppService } from './app.service';
import { RedirectToLoginFilter } from './filters/auth-exceptions.filter'
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
export class AppController
{
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly appService: AppService) {}

	@Get('')
	@UseGuards(JwtAuthGuard)
	@UseFilters(RedirectToLoginFilter)
	getHello(@Query() query: { plain: string, pass: string },
		@Req() request: Request): string
	{
		return 'Coucou';
	}

	// @Post()
	// getNameList(@Body() message: string)
	// {
	// 	this.logger.log(message);
	// 	return message;
	// }
}
