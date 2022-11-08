import { Module } from '@nestjs/common';
import { MySocket } from './websocket';

@Module({
	providers: [MySocket],
})
export class WebsocketModule {}
