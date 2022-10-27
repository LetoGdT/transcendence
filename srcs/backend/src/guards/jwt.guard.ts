import { Injectable, ExecutionContext, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')
{
	private logger = new Logger(JwtAuthGuard.name);

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		)
	{
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const cookie_options = {
				maxAge: 30000,
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			}

		try
		{
			const accessToken = ExtractJwt.fromExtractors([(request: Request) => {
				let data = request?.cookies["auth_cookie"];
				if (!data)
				{
					return null;
				}
				console.log(data);
				return data;
			}]);
			if (!accessToken)
				throw new UnauthorizedException('Access token is not set');

			const isValidAccessToken = this.authService.validateToken(accessToken);
			if (isValidAccessToken) return this.activate(context);

			const refreshToken = request.cookies['refresh_token'];
			if (!refreshToken)
				throw new UnauthorizedException('Refresh token is not set');
			const isValidRefreshToken = this.authService.validateToken(refreshToken);
			if (!isValidRefreshToken)
				throw new UnauthorizedException('Refresh token is not valid');

			const user = await this.userService.getByRefreshToken(refreshToken);
			const {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			} = this.authService.createTokens(user.id);

			await this.userService.updateRefreshToken(user.id, newRefreshToken);

			request.cookies['access_token'] = newAccessToken;
			request.cookies['refresh_token'] = newRefreshToken;

			response.cookie('access_token', newAccessToken, cookie_options);
			response.cookie(
				'refresh_token',
				newRefreshToken,
				cookie_options,
				);

			return this.activate(context);
		}

		catch (err)
		{
			this.logger.error(err.message);
			response.clearCookie('access_token', cookie_options);
			response.clearCookie('refresh_token', cookie_options);
			return false;
		}
	}

	async activate(context: ExecutionContext): Promise<boolean>
	{
		return super.canActivate(context) as Promise<boolean>;
	}

	handleRequest(err, user)
	{
		if (err || !user)
		{
			throw new UnauthorizedException();
		}

		return user;
	}
}