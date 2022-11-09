import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/user.entity';
import { Message } from './typeorm/message.entity';
import { MessagesModule } from './messages/messages.module';

@Module(
	{
		imports: [
			AuthModule,
			UsersModule,
			ConfigModule.forRoot(),
			TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => (
				{
					type: 'postgres',
					host: configService.get('DB_HOST'),
					port: +configService.get<number>('DB_PORT'),
					username: configService.get('DB_USERNAME'),
					password: configService.get('DB_PASSWORD'),
					database: configService.get('DB_NAME'),
					entities: [User, Message],
					synchronize: true,
				}
			),
			inject: [ConfigService],
			}),
			ServeStaticModule.forRoot({
				rootPath: resolve(__dirname, '..', 'build'),
				exclude: ['/api*, /log, /logout, /callback'],
			}),
			MessagesModule
		],
		controllers: [AppController],
		providers: [AppService],
	}
)
export class AppModule {}
