import { Module } from '@nestjs/common';
import { MySocket } from './websocket.ts';

@Module({
	providers: [MySocket],
})
export class WebsocketModule {}
