import { ArgumentsHost, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
export declare class RedirectToLoginFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost): void;
}
