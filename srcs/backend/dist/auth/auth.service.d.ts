import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../typeorm/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    verifyToken(token: string): boolean;
    tokenOwner(token: string): Promise<User>;
    createTokens(id: number): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
export declare class Api42 {
    token: string;
    refresh: string;
    private readonly logger;
    private readonly http;
    private readonly configService;
    setToken(auth_code: string): Promise<void>;
    refreshToken(): Promise<void>;
    isTokenValid(): Promise<boolean>;
    get(endpoint: string): Promise<any>;
}
