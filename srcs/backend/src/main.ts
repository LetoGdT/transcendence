import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { NotFoundExceptionFilter } from './filters/http-exception.filter';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap()
{
	const app = await NestFactory.create(AppModule, new AuthModule);
	app.setGlobalPrefix('api', {
		exclude: [{ path: 'log', method: RequestMethod.GET },
		{ path: 'logout', method: RequestMethod.GET },
		{ path: 'callback', method: RequestMethod.GET },
		{ path: 'gen_token', method: RequestMethod.GET }],
	});
	app.useGlobalFilters(new NotFoundExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors({ origin: ['http://localhost:3000', 'http://localhost:9998'], credentials: true });
	app.use(cookieParser());
	await app.listen(9999);
}
bootstrap();