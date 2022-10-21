import { Controller, Get, Post, Logger, Redirect, Query, HttpStatus, HttpException, Res } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { randomBytes } from 'crypto';
import { Api42 } from './auth.service';

@Controller()
export class AuthController
{
	state: string;
	private readonly logger = new Logger(Api42.name);
	private readonly configService = new ConfigService;

	constructor(private readonly http: HttpService) {}

	@Redirect('', 301)
	@Get('/log')
	redirect(@Res() res)
	{
		let host: string = 'https://api.intra.42.fr/oauth/authorize';
		let uid: string = this.configService.get<string>('UID');
		let secret: string = this.configService.get<string>('SECRET');
		let redirect_uri: string = 'http://localhost:3000/callback';
		let state: string = randomBytes(32).toString("hex");
		this.state = state;
		let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
		return {
			url: url
		};
	}

	@Get('/callback')
	async getCode(@Query() query: { code: string, state: string })
	{
		if (!query.code || !this.state || query.state != this.state) // Avoid CSRF
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		let api = new Api42();
		await api.setToken(query.code);
		if (!(await api.isTokenValid()))
			await api.refreshToken();
		let me = await api.get('/v2/me')
		return (me.login);
	}
}
