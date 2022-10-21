import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    getHello(query: {
        plain: string;
        pass: string;
    }): Promise<boolean>;
    getNameList(message: string): string;
}
