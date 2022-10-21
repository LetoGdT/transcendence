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
	private readonly logger = new Logger(Api42.name); // Debug
	private readonly http = new HttpService(); // Used to make http requests
	private readonly configService = new ConfigService; // To get .env variables

	// Create a token from an auth code (provided by the 42's login api)
	// Make sure to await to get the token or it will be empty !
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

	// Uses the refresh token obtained with the token to get a new token
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

	// Check if current token is valid
	async isTokenValid(): Promise<boolean>
	{
		let info = await this.get('/oauth/token/info');
		if (info.error)
			return false;
		return true;
	}

	// Get request on 42's api
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

	// Probably won't need post ever on 42's api
	// async post(endpoint: string): Promise<object>
}
