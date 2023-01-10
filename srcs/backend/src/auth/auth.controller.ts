import {
	Controller, Get, Post, Logger, Redirect,
	Query, HttpStatus, HttpException, Res, Req, UseGuards,
	UseFilters, Request, UseInterceptors, Body, BadRequestException,
	UnauthorizedException, ClassSerializerInterceptor
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
import { JwtAuthGuard, JwtAuthGuardWithout2Fa } from '../guards/jwt.guard';
import { AuthInterceptor } from './auth.interceptor';
import { RequestWithUser } from '../interfaces/RequestWithUser.interface';

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
	redirect(@Res() res: Response): { url: string }
	{
		let host: string = 'https://api.intra.42.fr/oauth/authorize';
		let uid: string | undefined = this.configService.get<string>('UID');
		let secret: string | undefined = this.configService.get<string>('SECRET');
		if (uid == undefined || secret == undefined)
			throw new HttpException('42API credentials not set. Did you forget to create .env ?',
				HttpStatus.INTERNAL_SERVER_ERROR);
		let redirect_uri: string = 'http://localhost:9999/callback';
		let state: string = randomBytes(32).toString("hex");
		this.state = state;
		let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
		return { url: url };
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
		const user: User = await this.usersService.addUser({ uid: me.id, username: me.login, email: me.email, image_url: me.image.link });
		const { access_token, refresh_token } = await this.authService.createTokens(user.id, !user.enabled2fa);
		res.cookie('access_token', access_token,
			{
				httpOnly: true,		// Prevent xss
				sameSite: 'lax',	// Prevent CSRF
				secure: true,		// Just info for the browser
			}
		);
		if (!user.enabled2fa)
		{		
			res.cookie('refresh_token', refresh_token,
				{
					httpOnly: true,		// Prevent xss
					sameSite: 'lax',	// Prevent CSRF
					secure: true,		// Just info for the browser
				}
			);
			return (res.redirect('http://localhost:3000'));
		}
		return (res.redirect('http://localhost:3000/2fa'));
	}

	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	logout(@Res({ passthrough: true }) res: Response,
			@Req() req: RequestWithUser)
	{
		req.user.refresh_expires = Date();
		this.usersService.updateOne(req.user.id, req.user);
		res.clearCookie('access_token',
			{
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			}
		);
		res.clearCookie('refresh_token',
			{
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			}
		);
		return (res.redirect('http://localhost:3000/'));
	}

	@Get('/gen_token')
	genToken(@Query() params: { id: number })
	{
		if (params.id == null)
			throw new BadRequestException('You need to specify an id');
		return this.authService.createTokens(params.id, true);
	}

	@Get('/2fa/generate')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(AuthInterceptor)
	async register(@Res() response: Response,
		@Req() req: RequestWithUser)
	{
		if (req.user.enabled2fa)
			throw new UnauthorizedException('You already have 2fa enabled');
		const { otpauthUrl } = await this.authService.generate2faSecret(req.user);
		return this.authService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('/2fa/enable')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	enable2fa(@Req() req: RequestWithUser, @Body() { code } : { code: string })
	{
		if (req.user.secret2fa == null)
			throw new UnauthorizedException('You first need to generate a QR code')
		const isCodeValid = this.authService.is2faCodeValid(code, req.user);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		return this.usersService.enable2fa(req.user);
	}

	@Post('/2fa/disable')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	disable2fa(@Req() req: RequestWithUser)
	{
		return this.usersService.disable2fa(req.user);
	}

	@Post('/2fa/authenticate')
	@UseGuards(JwtAuthGuardWithout2Fa)
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	async authenticate(@Req() req: RequestWithUser, @Body() { code } : { code: string },
		@Res({ passthrough: true }) res: Response)
	{
		if (!req.user.enabled2fa)
			throw new UnauthorizedException('You don\'t have 2fa enabled');
		const isCodeValid = this.authService.is2faCodeValid(code, req.user);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		const { access_token, refresh_token } = await this.authService.createTokens(req.user.id, true);
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
	}

}