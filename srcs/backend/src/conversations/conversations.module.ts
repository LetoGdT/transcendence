import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MessagesModule } from '../messages/messages.module'
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Conversation } from '../typeorm/conversation.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Conversation]), MessagesModule, AuthModule, UsersModule],
	controllers: [ConversationsController],
	providers: [ConversationsService]
})
export class ConversationsModule {}
