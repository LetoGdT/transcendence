import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './jwt.config'

@Module({
	imports: [
		HttpModule,
		JwtModule.registerAsync(jwtConfig),
		ConfigModule
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
