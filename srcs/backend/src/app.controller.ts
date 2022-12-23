import { Controller, Post, UseInterceptors, ClassSerializerInterceptor, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthInterceptor } from './auth/auth.interceptor';
import { Express } from 'express';

@Controller()
export class AppController
{
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(AuthInterceptor)
	uploadImage(@UploadedFile() file: Express.Multer.File)
	{
		const serialized = file.buffer.toString("base64");
		const deserialized = Buffer.from(serialized, "base64");
		console.log(deserialized.toString("utf8"));
	}
}