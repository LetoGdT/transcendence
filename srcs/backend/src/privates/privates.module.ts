import { Module } from '@nestjs/common';
import { PrivatesController } from './privates.controller';
import { PrivatesService } from './privates.service';
import { MessagesModule } from '../messages/messages.module'

@Module({
	imports: [MessagesModule],
	controllers: [PrivatesController],
	providers: [PrivatesService]
})
export class PrivatesModule {}
