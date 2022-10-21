import
{
	Controller, Get, Post, Query,
	Logger, Body, HttpStatus, HttpException
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express'

@Controller()
export class AppController
{
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly appService: AppService) {}

	@Get()
	async getHello(@Query() query: { plain: string, pass: string }): Promise<boolean>
	{
		if (!query.plain || !query.pass)
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const hash = await this.appService.getHashedPassword(query.plain);
		return await this.appService.checkPassword(query.pass, hash);
	}

	@Post()
	getNameList(@Body() message: string)
	{
		this.logger.log(message);
		return message;
	}
}
