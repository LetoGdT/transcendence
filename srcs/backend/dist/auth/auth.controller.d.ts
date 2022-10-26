import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
export declare class AuthController {
    private readonly http;
    private readonly configService;
    private jwtService;
    state: string;
    private readonly logger;
    constructor(http: HttpService, configService: ConfigService, jwtService: JwtService);
    redirect(res: any): {
        url: string;
    };
    getCode(query: {
        code: string;
        state: string;
    }, res: Response): Promise<void>;
    movies(req: any): Promise<any>;
    logout(res: Response): void;
}
