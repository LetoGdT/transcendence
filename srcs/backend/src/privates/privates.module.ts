import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivatesController } from './privates.controller';
import { PrivatesService } from './privates.service';
import { MessagesModule } from '../messages/messages.module'
import { PrivateMessage } from '../typeorm/private-message.entity';

@Module({
	imports: [TypeOrmModule.forFeature([PrivateMessage]), MessagesModule],
	controllers: [PrivatesController],
	providers: [PrivatesService]
})
export class PrivatesModule {}
