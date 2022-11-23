import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MySocketGateway } from './websocket.gateway';

@Module({
	imports: [AuthModule],
	providers: [MySocketGateway],
})
export class WebsocketModule {}
