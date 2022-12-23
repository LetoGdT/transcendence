import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MessagesModule } from '../messages/messages.module'
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { Conversation } from '../typeorm/conversation.entity';
import { Message } from '../typeorm/message.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Conversation, Message]), MessagesModule, AuthModule, UsersModule, AchievementsModule],
	controllers: [ConversationsController],
	providers: [ConversationsService]
})
export class ConversationsModule {}
