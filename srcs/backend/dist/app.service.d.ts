export declare class AppService {
    private readonly logger;
    getHashedPassword(password: string): Promise<string>;
    checkPassword(password: string, hash: string): Promise<boolean>;
}
