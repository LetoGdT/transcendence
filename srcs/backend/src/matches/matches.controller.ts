import { Controller, Get, Query, ClassSerializerInterceptor, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { PageOptionsDto } from "../dto/page-options.dto";
import { MatchesQueryFilterDto } from '../dto/query-filters.dto';

@Controller('matches')
export class MatchesController
{
	constructor(private readonly matchesService: MatchesService) {}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	async getAllMatches(@Query() pageOptionsDto: PageOptionsDto,
		@Query() matchesQueryFilterDto: MatchesQueryFilterDto)
	{
		return this.matchesService.getAllMatches(pageOptionsDto, matchesQueryFilterDto);
	}

	@Get('/:user_id/winrate')
	@UseInterceptors(ClassSerializerInterceptor)
	async getWinrate(@Param('user_id', ParseIntPipe) user_id: number,)
	{
		return this.matchesService.getWinrate(user_id);
	}
}
