import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter
{
	catch(exception: NotFoundException, host: ArgumentsHost)
	{
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		response.status(HttpStatus.NOT_FOUND);
		response.sendFile('/usr/src/app/src/static/html/404.html');
	}
}