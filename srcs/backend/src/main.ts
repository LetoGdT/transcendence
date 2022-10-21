import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { NotFoundExceptionFilter } from './filters/http-exception.filter';
import * as express from 'express';

async function bootstrap()
{
	const app = await NestFactory.create(AppModule, new AuthModule);
	app.useGlobalFilters(new NotFoundExceptionFilter())
	await app.listen(3000);
}
bootstrap();
