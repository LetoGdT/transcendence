import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Match } from '../typeorm/match.entity';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
	imports: [TypeOrmModule.forFeature([Match]), forwardRef(() => AuthModule), AchievementsModule, forwardRef(() => UsersModule)],
	controllers: [MatchesController],
	providers: [MatchesService],
	exports: [MatchesService]
})
export class MatchesModule {}
