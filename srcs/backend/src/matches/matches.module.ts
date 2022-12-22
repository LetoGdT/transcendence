import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { AuthModule } from '../auth/auth.module';
import { Match } from '../typeorm/match.entity';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
	imports: [TypeOrmModule.forFeature([Match]), AuthModule, AchievementsModule],
	controllers: [MatchesController],
	providers: [MatchesService]
})
export class MatchesModule {}
