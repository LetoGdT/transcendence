import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Match } from '../typeorm/match.entity';
import { User } from '../typeorm/user.entity';
import { MatchesQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";

@Injectable()
export class MatchesService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Match) private readonly matchesRepository: Repository<Match>,) {}

	async getAllMatches(pageOptionsDto: PageOptionsDto,
		matchesQueryFilterDto: MatchesQueryFilterDto,
		user_id?: number)
	{
		const queryBuilder = this.matchesRepository.createQueryBuilder('match')

		queryBuilder
			.leftJoinAndSelect('match.user1', 'user1')
			.leftJoinAndSelect('match.user2', 'user2')
			.leftJoinAndSelect('match.winner', 'winner')
			.where(matchesQueryFilterDto.id != null
				? 'match.id = :id'
				: 'TRUE', { id: matchesQueryFilterDto.id })
			.andWhere(new Brackets(qb => {
				qb.where(matchesQueryFilterDto.user_id != null
				? 'user1.id = :user_id'
				: 'TRUE', { user_id: matchesQueryFilterDto.user_id })
				.orWhere(matchesQueryFilterDto.user_id != null
				? 'user2.id = :user_id'
				: 'TRUE', { user_id: matchesQueryFilterDto.user_id })
			}))
			.andWhere(new Brackets(qb => {
				qb.where(user_id != null
				? 'user1.id = :user_id'
				: 'TRUE', { user_id: user_id })
				.orWhere(user_id != null
				? 'user2.id = :user_id'
				: 'TRUE', { user_id: user_id })
			}))
			.andWhere(matchesQueryFilterDto.winner_id != null
				? 'winner.id = :id'
				: 'TRUE', { id: matchesQueryFilterDto.winner_id })
			.andWhere(matchesQueryFilterDto.start_at != null
				? 'match.played_at > :start_at'
				: 'TRUE', { start_at: matchesQueryFilterDto.start_at })
			.andWhere(matchesQueryFilterDto.end_at != null
				? 'match.played_at < :end_at'
				: 'TRUE', { end_at: matchesQueryFilterDto.end_at })
			.andWhere(matchesQueryFilterDto.type != null
				? 'match.game_type = :type'
				: 'TRUE', { type: matchesQueryFilterDto.type })
			.orderBy('match.played_at', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);
			
		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async getWinrate(id: number)
	{
		const wins: number = await this.matchesRepository.createQueryBuilder('match')
			.where('match.winner = :id', { id: id })
			.getCount();

		const losses: number = await this.matchesRepository.createQueryBuilder('match')
			.where('match.winner != :id', { id: id })
			.getCount();

		const winrate = wins / losses * 100;
		return { wins: wins, losses: losses, winrate: winrate };
	}
}
