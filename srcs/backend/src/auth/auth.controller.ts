import {
	Controller, Get, Post, Logger, Redirect,
	Query, HttpStatus, HttpException, Res, Req, UseGuards,
	UseFilters, Request, UseInterceptors
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { randomBytes } from 'crypto';
import { Api42 } from './auth.service';
import { RedirectToLoginFilter } from '../filters/auth-exceptions.filter';
import { CreateUserDto } from '../dto/users.dto';
import { UsersService } from '../users/users.service';
import { User } from '../typeorm/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthInterceptor } from './auth.interceptor'

@Controller()
export class AuthController
{
	state: string;
	private readonly logger = new Logger(Api42.name);

	constructor(private readonly configService: ConfigService,
				private jwtService: JwtService,
				private readonly usersService: UsersService,
				private readonly authService: AuthService) {}

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
		let redirect_uri: string = 'http://localhost:9999/callback';
		let state: string = randomBytes(32).toString("hex");
		this.state = state;
		let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
		return {
			url: url
		};
	}

	@Get('/callback')
	async getCode(@Query() query: { code: string, state: string },
		@Res({ passthrough: true }) res: Response)
	{
		if (!query.code || !this.state) // Avoid CSRF
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		if (query.state != this.state)
			throw new HttpException('CSRF attempt detected !', HttpStatus.FORBIDDEN);
		let api = new Api42();
		await api.setToken(query.code);
		let me = await api.get('/v2/me');
		const user: User = await this.usersService.addUser({ uid: me.id, username: me.login, email: me.email, image_url: me.image_url });
		const { access_token, refresh_token } = await this.authService.createTokens(user.id);
		res.cookie('access_token', access_token,
			{
				httpOnly: true,		// Prevent xss
				sameSite: 'lax',	// Prevent CSRF
				secure: true,		// Just info for the browser
			}
		);
		res.cookie('refresh_token', refresh_token,
			{
				httpOnly: true,		// Prevent xss
				sameSite: 'lax',	// Prevent CSRF
				secure: true,		// Just info for the browser
			}
		);
		return (res.redirect('/'));
	}

	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	@UseFilters(RedirectToLoginFilter)
	@UseInterceptors(AuthInterceptor)
	logout(@Res({ passthrough: true }) res: Response,
			@Req() req)
	{
		req.user.refresh_expires = Date();
		this.usersService.updateOne(req.user.id, req.user);
		res.clearCookie('access_token',
			{
				httpOnly: true,		// Prevent xss
				sameSite: 'lax',	// Prevent CSRF
				secure: true,		// Just info for the browser
			}
		);
		res.clearCookie('refresh_token',
			{
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			}
		);
		return (res.redirect('/'));
	}
}