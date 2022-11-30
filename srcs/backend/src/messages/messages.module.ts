import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from '../typeorm/message.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Message]), UsersModule, AuthModule],
	controllers: [MessagesController],
	providers: [MessagesService],
	exports: [MessagesService]
})
export class MessagesModule {}
