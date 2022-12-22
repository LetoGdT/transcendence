import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Channel } from '../typeorm/channel.entity';
import { ChannelUser } from '../typeorm/channel-user.entity';
import { ChannelBan } from '../typeorm/channel-ban.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, ChannelUser, ChannelBan]),
		AuthModule, MessagesModule, AchievementsModule],
	controllers: [ChannelsController],
	providers: [ChannelsService]
})
export class ChannelsModule {}
