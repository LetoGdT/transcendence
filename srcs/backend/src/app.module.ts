import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module(
	{
		imports: [
			AuthModule,
			UsersModule,
			ConfigModule.forRoot(),
			// TypeOrmModule.forRootAsync({
			// imports: [ConfigModule],
			// useFactory: (configService: ConfigService) => (
			// 	{
			// 		type: 'postgres',
			// 		host: configService.get('DB_HOST'),
			// 		port: +configService.get<number>('DB_PORT'),
			// 		username: configService.get('DB_USERNAME'),
			// 		password: configService.get('DB_PASSWORD'),
			// 		database: configService.get('DB_NAME'),
			// 		entities: [],
			// 		synchronize: true,
			// 	}
			// ),
			// inject: [ConfigService],
			// }),
		],
		controllers: [AppController],
		providers: [AppService],
	}
)
export class AppModule {}
