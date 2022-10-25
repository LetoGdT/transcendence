import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";

@Catch(UnauthorizedException)
export class RedirectToLoginFilter implements ExceptionFilter
{
	catch(exception: UnauthorizedException, host: ArgumentsHost)
	{
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const status = exception.getStatus();
		response.status(status).redirect('/log');
	}
}