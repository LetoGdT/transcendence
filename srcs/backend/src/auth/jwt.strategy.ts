import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{
    // private readonly configService = new ConfigService;

    constructor(private readonly configService: ConfigService)
    {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            jwtFromRequest:ExtractJwt.fromExtractors([(request: Request) => {
                let data = request?.cookies["auth-cookie"];
                if(!data)
                {
                    return null;
                }
                return data.token;
            }])
        });
    }
 
    async validate(payload: any)
    {
        if(payload === null)
        {
            throw new UnauthorizedException();
        }
        return payload;
    }
}