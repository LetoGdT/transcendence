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
		console.log(isValidAccessToken);
		if (isValidAccessToken)
			return true;

		// TO DO !! Refresh token has to be independant from access token,
		// so I have to do a search by refresh token instead of searching
		// with the old access token which might be unset.
		const user = await this.authService.tokenOwner(accessToken);

		const refreshToken = await request.cookies['refresh_token'];
		if (!refreshToken)
			throw new UnauthorizedException('Refresh token is not set');
		const expires: Date = new Date(user.refresh_expires);
		const today: Date = new Date();
		if (refreshToken != user.refresh_token || expires < today)
		{
			if (expires < today)
				console.log('Refresh expired');
			throw new UnauthorizedException('Refresh token is not valid');
		}

		const {
			access_token: newAccessToken,
			refresh_token: newRefreshToken,
		} = await this.authService.createTokens(user.id);

		request.cookies['access_token'] = newAccessToken;
		request.cookies['refresh_token'] = newRefreshToken;

		response.cookie('access_token', newAccessToken, cookie_options);
		response.cookie('refresh_token', newRefreshToken, cookie_options);

		return true;
	}
}