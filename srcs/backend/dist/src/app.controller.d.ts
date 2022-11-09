import { Request } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    getHello(query: {
        plain: string;
        pass: string;
    }, request: Request): string;
    test(): string;
}
