import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Channel } from '../typeorm/channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel]), AuthModule],
	controllers: [ChannelsController],
	providers: [ChannelsService]
})
export class ChannelsModule {}
