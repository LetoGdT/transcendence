import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { User } from './typeorm/user.entity';
import { Message } from './typeorm/message.entity';
import { Channel } from './typeorm/channel.entity';
import { Conversation } from './typeorm/conversation.entity';
import { ChannelUser } from './typeorm/channel-user.entity';
import { ChannelBan } from './typeorm/channel-ban.entity';
import { Achievement } from './typeorm/achievement.entity';
import { AchievementType } from './typeorm/achievement-type.entity';
import { Match } from './typeorm/match.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ChannelsModule } from './channels/channels.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AchievementsModule } from './achievements/achievements.module';
import { MatchesModule } from './matches/matches.module';

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
					entities: [User, Message, Channel, ChannelUser, ChannelBan, Conversation,
						Achievement, AchievementType, Match],
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
			ChannelsModule,
			WebsocketModule,
			ConversationsModule,
			AchievementsModule,
			MatchesModule
		],
	}
)
export class AppModule {}
