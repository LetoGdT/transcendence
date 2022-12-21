import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsController } from './achievements.controller';
import { AuthModule } from '../auth/auth.module';
import { AchievementsService } from './achievements.service';
import { Achievement } from '../typeorm/achievement.entity';
import { AchievementType } from '../typeorm/achievement-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Achievement, AchievementType]),
		forwardRef(() => AuthModule)],
	controllers: [AchievementsController],
	providers: [AchievementsService],
	exports: [AchievementsService]
})
export class AchievementsModule {}
