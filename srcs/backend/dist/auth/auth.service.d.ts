export declare class AuthService {
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
