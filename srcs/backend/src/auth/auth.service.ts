import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import * as randtoken from 'rand-token';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { User } from '../typeorm/user.entity';

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
	async tokenOwner(token: string): Promise<User | null>
	{
		const decoded = this.jwtService.decode(token) as { username: string, sub: number };
		if (decoded == null)
			return null;
		const ret = await this.userRepository.createQueryBuilder("user")
			.where("user.id = :id", { id: decoded.sub })
			.getOne();

		if (ret == null)
			throw new HttpException('An unexpected error occured: token owner does not exist',
				HttpStatus.INTERNAL_SERVER_ERROR);

		return ret;
	}

	tokenInfos(token: string): { username: string, sub: number, enabled2fa: boolean }
	{
		return this.jwtService.decode(token) as { username: string, sub: number, enabled2fa: boolean };
	}

	// Returns a new token/refresh pair
	async createTokens(id: number,
		enabled2fa: boolean): Promise<{ access_token: string, refresh_token: string }>
	{
		const user = await this.userRepository.findOne({where: { id: id }});
		if (user == null)
			throw new HttpException('An unexpected error occured: user does not exist',
				HttpStatus.INTERNAL_SERVER_ERROR);

		const payload = { username: user.username, sub: user.id, enabled2fa: enabled2fa };
		const access_token = await this.jwtService.sign(payload);
		const refresh_token = randtoken.generate(16);
		const expires = new Date();
		expires.setDate(expires.getDate() + 6);
		this.userRepository.update(id,
			{ refresh_token: refresh_token, refresh_expires: expires.toDateString() });
		return { access_token: access_token, refresh_token: refresh_token };
	}

	async generate2faSecret(user: User)
	{
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);

		await this.userRepository.update(user.id, {
			secret2fa: secret
		});

		return {
			secret,
			otpauthUrl
		}
	}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string)
	{
		return toFileStream(stream, otpauthUrl);
	}

	is2faCodeValid(code: string, user: User)
	{
		return authenticator.verify({
			token: code,
			secret: user.secret2fa
		})
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
