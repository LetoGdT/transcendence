import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../typeorm/user.entity';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), AchievementsModule,
    MatchesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
