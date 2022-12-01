import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import * as randtoken from 'rand-token';
import { User } from '../typeorm/user.entity';


// { username: 'tlafay', sub: '4', iat: 1666947580, exp: 1666947610 }

@Injectable()
export class AuthService
{
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
				private readonly jwtService: JwtService,) {}

	// Check if token is valid
	verifyToken(token: string): boolean
	{
		try
		{
			// Change this to true to expire tokens in prod
			this.jwtService.verify(token, { ignoreExpiration: true });
			return true;
		}
		catch (err)
		{
			return false;
		}
	}

	// Return the token info.
	// Doesn't check the token validity, so use with caution !
	async tokenOwner(token: string): Promise<User>
	{
		const decoded = this.jwtService.decode(token) as { username: string, sub: number };
		return await this.userRepository.createQueryBuilder("user")
			.where("user.id = :id", { id: decoded.sub })
			.getOne();
	}

	// Returns a new token/refresh pair
	async createTokens(id: number): Promise<{ access_token: string, refresh_token: string }>
	{
		const user = await this.userRepository.findOne({where: { id: id }});
		const payload = { username: user.username, sub: user.id };
		const access_token = await this.jwtService.sign(payload);
		const refresh_token = randtoken.generate(16);
		const expires = new Date();
		expires.setDate(expires.getDate() + 6);
		this.userRepository.update(id,
			{ refresh_token: refresh_token, refresh_expires: expires.toDateString() });
		return { access_token: access_token, refresh_token: refresh_token };
	}
}

@Injectable()
export class Api42
{
	token: string;
	refresh: string;
	private readonly logger = new Logger(Api42.name);	// Debug
	private readonly http = new HttpService();			// Used to make http requests
	private readonly configService = new ConfigService;	// To get .env variables

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
				redirect_uri: 'http://localhost:9999/callback',
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
