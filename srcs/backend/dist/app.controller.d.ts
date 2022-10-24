import { AppService } from './app.service';
import { Request } from 'express';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    getHello(query: {
        plain: string;
        pass: string;
    }, request: Request): string;
}
