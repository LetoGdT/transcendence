import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Match } from '../typeorm/match.entity';
import { User } from '../typeorm/user.entity';
import { UsersService } from '../users/users.service';
import { MatchesQueryFilterDto } from '../dto/query-filters.dto';
import { PageOptionsDto } from "../dto/page-options.dto";
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { CreateMatchDto } from "../dto/matches.dto";

@Injectable()
export class MatchesService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Match) private readonly matchesRepository: Repository<Match>,
		private readonly usersService: UsersService) {}

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
				? 'user1.id = :my_id'
				: 'TRUE', { my_id: user_id })
				.orWhere(user_id != null
				? 'user2.id = :my_id'
				: 'TRUE', { my_id: user_id })
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
			.andWhere('match.game_type = :game_type', { game_type: 'Ranked' })
			.getCount();

		const losses: number = await this.matchesRepository.createQueryBuilder('match')
			.where('match.winner != :id', { id: id })
			.andWhere('match.game_type = :game_type', { game_type: 'Ranked' })
			.getCount();

		const winrate: number = wins / (wins + losses) * 100;
		return { wins: wins, losses: losses, winrate: winrate };
	}

	async createMatch(createMatchDto: CreateMatchDto)
	{
		const newMatch: Match = this.matchesRepository.create(createMatchDto);
		return this.matchesRepository.save(newMatch);
	}

	// Lucille this is for you
	async calculateRank(match_id: number): Promise<void>
	{
		if (match_id > this.IdMax)
			throw new BadRequestException(`id must not be greater than ${this.IdMax}`);

		const queryBuilder = this.matchesRepository.createQueryBuilder('match')

		queryBuilder
			.leftJoinAndSelect('match.user1', 'user1')
			.leftJoinAndSelect('match.user2', 'user2')
			.leftJoinAndSelect('match.winner', 'winner')
			.where('match.id = :id', { match_id: match_id });

		const match: Match | null = await queryBuilder.getOne();

		if (match == null)
			throw new BadRequestException("Invalid match id: calculateRank()");


		// All the data you could ever want.
		const user1_exp: number = match.user1.exp;
		const user2_exp: number = match.user2.exp;
		const score_user1: number = match.score_user1;
		const score_user2: number = match.score_user2;
		const winner: User = match.winner;

		// Those are the variables that will be saved at the end.
		// CHANGE THESE !!!
		let newUser1_exp: number = user1_exp;
		let newUser2_exp: number = user2_exp;

		/******** YOUR CODE HERE ********/



		/******** END OF YOUR CODE ********/

		this.usersService.changeRank(match.user1, newUser1_exp);
		this.usersService.changeRank(match.user2, newUser2_exp);
	}
}
