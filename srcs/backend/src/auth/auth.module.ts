import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
	imports: [
		UsersModule,
		HttpModule,
		JwtModule.registerAsync(jwtConfig),
		ConfigModule
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, JwtStrategy]
})
export class AuthModule {}
