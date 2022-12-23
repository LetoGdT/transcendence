import { Controller, Get, ClassSerializerInterceptor, UseInterceptors, Query } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { PageOptionsDto } from "../dto/page-options.dto";
import { UserQueryFilterDto } from '../dto/query-filters.dto';

@Controller('achievements')
export class AchievementsController
{
	constructor(private readonly achievementsService: AchievementsService) {}

	@Get('/types')
	@UseInterceptors(ClassSerializerInterceptor)
	async getAchievementTypes(@Query() pageOptionsDto: PageOptionsDto)
	{
		return this.achievementsService.getAchievementTypes(pageOptionsDto);
	}
}
