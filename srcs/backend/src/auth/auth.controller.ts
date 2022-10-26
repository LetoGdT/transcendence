import {
	Controller, Get, Post, Logger, Redirect,
	Query, HttpStatus, HttpException, Res, Req, UseGuards,
	UseFilters, Request, Headers
} from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { randomBytes } from 'crypto';
import { Api42 } from './auth.service';
import { RedirectToLoginFilter } from '../filters/auth-exceptions.filter'
import { CreateUserDto } from '../dto/users.dto';
import { UsersService } from '../users/users.service'

@Controller()
export class AuthController
{
	state: string;
	private readonly logger = new Logger(Api42.name);

	constructor(private readonly http: HttpService,
				private readonly configService: ConfigService,
				private jwtService: JwtService,
				private readonly usersService: UsersService) {}

	@Redirect('', 302)
	@Get('/log')
	redirect(@Res() res)
	{
		let host: string = 'https://api.intra.42.fr/oauth/authorize';
		let uid: string = this.configService.get<string>('UID');
		let secret: string = this.configService.get<string>('SECRET');
		if (uid == undefined || secret == undefined)
			throw new HttpException('42API credentials not set. Did you forget to create .env ?',
				HttpStatus.INTERNAL_SERVER_ERROR);
		let redirect_uri: string = 'http://localhost:3000/callback';
		let state: string = randomBytes(32).toString("hex");
		this.state = state;
		let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
		return {
			url: url
		};
	}

	@Get('/callback')
	async getCode(@Query() query: { code: string, state: string },
		@Res({ passthrough: true }) res: Response,
		@Headers() headers)
	{
		if (!query.code || !this.state) // Avoid CSRF
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		if (query.state != this.state)
			throw new HttpException('CSRF attempt detected !', HttpStatus.FORBIDDEN);
		let api = new Api42();
		await api.setToken(query.code);
		if (!(await api.isTokenValid()))
			await api.refreshToken();
		let me: CreateUserDto = await api.get('/v2/me');
		// this.logger.log(me);
		this.usersService.createUser(me);
		const payload = { username: me.login };						// Random stuff for now
		const access_token = await this.jwtService.sign(payload);	// Create a jwt
		res.cookie('auth_cookie', access_token,						// Set the jwt as cookie
			{
				maxAge: 3600 * 1000,	// 1h in ms
				httpOnly: true,			// Prevent xss
				sameSite: 'lax',		// Prevent CSRF
				secure: true,			// Just info for the browser
			}
		);
		return (res.redirect('/'));
	}

	@Get('/test')
	@UseGuards(AuthGuard('jwt'))
	@UseFilters(RedirectToLoginFilter)
	async movies(@Req() req)
	{
		return req.user.username;
	}

	@Get('/logout')
	logout(@Res({ passthrough: true }) res: Response)
	{
		res.clearCookie('auth_cookie',
			{
				maxAge: 3600 * 1000,	// 1h in ms
				httpOnly: true,			// Prevent xss
				sameSite: 'lax',		// Prevent CSRF
				secure: true,			// Just info for the browser
			}
		);
		return (res.redirect('/'));
	}
}
