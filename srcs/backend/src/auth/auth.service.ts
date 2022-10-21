import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {}

@Injectable()
export class Api42
{
	token: string;
	refresh: string;
	private readonly logger = new Logger(Api42.name);
	private readonly http = new HttpService();
	private readonly configService = new ConfigService;

	async setToken(auth_code: string): Promise<void>
	{
		const checkResultObservable = this.http.post(
			'https://api.intra.42.fr/oauth/token',
			{
				grant_type: 'authorization_code',
				client_id: this.configService.get<string>('UID'),
				client_secret: this.configService.get<string>('SECRET'),
				redirect_uri: 'http://localhost:3000/callback',
				code: auth_code
			},
		);
		const checkResult = await (await lastValueFrom(checkResultObservable)).data;
		this.token = checkResult.access_token;
		this.refresh = checkResult.refresh_token;
	}

	async refreshToken(): Promise<void>
	{
		const refresh = this.http.post(
			'https://api.intra.42.fr/oauth/token',
			{
				grant_type: 'refresh_token',
				refresh_token: this.refresh,
				client_id: this.configService.get<string>('UID'),
				client_secret: this.configService.get<string>('SECRET')
			},
		);
		const refreshJson = await (await lastValueFrom(refresh)).data;
		this.token = refreshJson.access_token;
		this.refresh = refreshJson.refresh_token;
	}

	async isTokenValid(): Promise<boolean>
	{
		let info = await this.get('/oauth/token/info');
		if (info.error)
			return false;
		return true;
	}

	async get(endpoint: string)//: Promise<object>
	{
		if (!this.token)
			return null;
		const headersRequest = {
			'Authorization': `Bearer ${this.token}`
		};
		const ret = this.http.get('https://api.intra.42.fr/' + endpoint, { headers: headersRequest });
		return (await (await lastValueFrom(ret)).data);
	}

	// async post(endpoint: string): Promise<object>
}
