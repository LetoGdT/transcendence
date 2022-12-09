import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/user.entity';
import { Message } from './typeorm/message.entity';
import { PrivateMessage } from './typeorm/private-message.entity';
import { Channel } from './typeorm/channel.entity';
import { Conversation } from './typeorm/conversation.entity';
import { ChannelUser } from './typeorm/channel-user.entity';
import { ChannelBan } from './typeorm/channel-ban.entity';
import { MessagesModule } from './messages/messages.module';
import { PrivatesModule } from './privates/privates.module';
import { ChannelsModule } from './channels/channels.module';
<<<<<<< HEAD
import { WebsocketModule } from './websocket/websocket.module';
=======
import { ConversationsModule } from './conversations/conversations.module';
>>>>>>> main

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
					entities: [User, Message, PrivateMessage, Channel, ChannelUser, ChannelBan, Conversation,],
					synchronize: true,
				}
			),
			inject: [ConfigService],
			}),
			// ServeStaticModule.forRoot({
			// 	rootPath: resolve(__dirname, '..', 'build'),
			// 	exclude: ['/api*, /log, /logout, /callback'],
			// }),
			MessagesModule,
			PrivatesModule,
			ChannelsModule,
<<<<<<< HEAD
			WebsocketModule
=======
			ConversationsModule
>>>>>>> main
		],
	}
)
export class AppModule {}
