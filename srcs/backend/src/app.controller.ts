import
{
	Controller, Get, Post, Query, Req, Headers, UseInterceptors,
	Logger, Body, HttpStatus, HttpException, UseGuards, UseFilters
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'
import { AppService } from './app.service';
import { RedirectToLoginFilter } from './filters/auth-exceptions.filter'
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthInterceptor } from './auth/auth.interceptor'

@Controller()
export class AppController
{
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly appService: AppService) {}

	@Get('')
	@UseInterceptors(AuthInterceptor)
	getHello(@Query() query: { plain: string, pass: string },
		@Req() request: Request): string
	{
		if (request.user)
			return ('Hello ' + request.user['username']);
		return '<a href="http://localhost:3000/log">Login</a>';
	}
}
