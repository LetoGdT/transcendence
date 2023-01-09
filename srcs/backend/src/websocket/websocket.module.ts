import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MySocketGateway } from './websocket.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [AuthModule, UsersModule],
	providers: [MySocketGateway, ChatService, Array],
})
export class WebsocketModule {}
