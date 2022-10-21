import { HttpService } from "@nestjs/axios";
export declare class AuthController {
    private readonly http;
    state: string;
    private readonly logger;
    private readonly configService;
    constructor(http: HttpService);
    redirect(res: any): {
        url: string;
    };
    getCode(query: {
        code: string;
        state: string;
    }): Promise<any>;
}
