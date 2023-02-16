import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { NotFoundExceptionFilter } from './filters/http-exception.filter';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap()
{
	const app = await NestFactory.create<NestExpressApplication>(AppModule, new AuthModule);
	app.setGlobalPrefix('api', {
		exclude: [{ path: 'log', method: RequestMethod.GET },
		{ path: 'logout', method: RequestMethod.GET },
		{ path: 'callback', method: RequestMethod.GET },
		{ path: 'gen_token', method: RequestMethod.GET }],
	});
	const configService = app.get(ConfigService);
	app.useGlobalFilters(new NotFoundExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors({ origin: [`${configService.get<string>('REACT_APP_REACT_HOSTNAME')}`], credentials: true });
	app.use(cookieParser());
	app.useStaticAssets(resolve(__dirname, '..', 'src', 'static', 'uploads'), {
		prefix: '/uploads/',
	});
	await app.listen(9999);
}
bootstrap();