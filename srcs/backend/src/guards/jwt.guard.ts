import { Injectable, ExecutionContext, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')
{
	private logger = new Logger(JwtAuthGuard.name);

	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		)
	{
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const cookie_options = {
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			}

		const accessToken: string = request?.cookies["access_token"];

		// Access granted if the token is already valid, else we check the refresh
		const isValidAccessToken = this.authService.verifyToken(accessToken);
		if (isValidAccessToken)
		{
			const tokenInfos = await this.authService.tokenInfos(accessToken);
			const tokenOwner = await this.authService.tokenOwner(accessToken);

			if (tokenOwner.enabled2fa && !tokenInfos.enabled2fa)
				return false;
			return true;
		}

		const refreshToken = await request.cookies['refresh_token'];
		if (!refreshToken)
			return false;
		const user = await this.usersService.getOneByRefresh(refreshToken);
		if (!user)
			return false;
		const expires: Date = new Date(user.refresh_expires);
		const today: Date = new Date();
		if (!user || refreshToken != user.refresh_token || expires < today)
			return false;

		const {
			access_token: newAccessToken,
			refresh_token: newRefreshToken,
		} = await this.authService.createTokens(user.id, true);

		request.cookies['access_token'] = newAccessToken;
		request.cookies['refresh_token'] = newRefreshToken;

		response.cookie('access_token', newAccessToken, cookie_options);
		response.cookie('refresh_token', newRefreshToken, cookie_options);
		return true;
	}
}

@Injectable()
export class JwtAuthGuardWithout2Fa extends AuthGuard('jwt')
{
	private logger = new Logger(JwtAuthGuard.name);

	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		)
	{
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();

		const accessToken: string = request?.cookies["access_token"];

		// Access granted if the token is already valid, else we check the refresh
		const isValidAccessToken = this.authService.verifyToken(accessToken);
		if (isValidAccessToken)
		{
			const tokenInfos = await this.authService.tokenInfos(accessToken);
			if (tokenInfos.enabled2fa)
				throw new UnauthorizedException('You are already authenticated');
			return true;
		}
		return false;
	}
}