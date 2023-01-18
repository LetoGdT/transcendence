import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [AuthModule],
	providers: [GameService, Array]
})
export class GameModule {}
