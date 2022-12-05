import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MySocketGateway } from './websocket.gateway';
import { ChatService } from './chat.service';

@Module({
	imports: [AuthModule],
	providers: [MySocketGateway, ChatService, Array],
})
export class WebsocketModule {}
