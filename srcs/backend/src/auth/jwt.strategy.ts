import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{
	constructor(private readonly configService: ConfigService)
	{
		super({
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				let data = request?.cookies["auth_cookie"];
				if (!data)
				{
					return null;
				}
				return data;
			}])
		});
	}

	async validate(payload: any)
	{
		if (payload === null)
		{
			throw new UnauthorizedException();
		}
		return payload;
	}
}