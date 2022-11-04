import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

// Get the JWT secret from .env
export const jwtConfig: JwtModuleAsyncOptions = {
	useFactory: () => {
		return {
		secret: process.env.JWT_SECRET,
		signOptions: { expiresIn: '5m' },
		};
	},
} 