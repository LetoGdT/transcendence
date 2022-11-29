import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Channel } from '../typeorm/channel.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel]), TypeOrmModule.forFeature([ChannelUser]),
		AuthModule, MessagesModule],
	controllers: [ChannelsController],
	providers: [ChannelsService]
})
export class ChannelsModule {}
