import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly http;
    private readonly configService;
    private jwtService;
    private readonly usersService;
    private readonly authService;
    state: string;
    private readonly logger;
    constructor(http: HttpService, configService: ConfigService, jwtService: JwtService, usersService: UsersService, authService: AuthService);
    redirect(res: any): {
        url: string;
    };
    getCode(query: {
        code: string;
        state: string;
    }, res: Response, headers: any): Promise<void>;
    movies(req: any): Promise<string>;
    logout(res: Response, req: any): void;
}
