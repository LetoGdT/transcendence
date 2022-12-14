import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [AuthModule],
	providers: [GameGateway, GameService, Array]
})
export class GameModule {}
