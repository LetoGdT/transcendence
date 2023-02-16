import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../typeorm/achievement.entity';
import { AchievementType } from '../typeorm/achievement-type.entity';
import { User } from '../typeorm/user.entity';
import { PageOptionsDto } from "../dto/page-options.dto";
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";

@Injectable()
export class AchievementsService
{
	IdMax: number = Number.MAX_SAFE_INTEGER;

	constructor(@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>,
		@InjectRepository(AchievementType) private readonly achievementTypeRepository: Repository<AchievementType>) {}

	async getAchievementTypes(pageOptionsDto: PageOptionsDto)
	{
		const queryBuilder = this.achievementTypeRepository.createQueryBuilder("achievementType");

		queryBuilder
			.orderBy("achievementType.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async getUserAchievements(pageOptionsDto: PageOptionsDto, user_id: number)
	{
		const queryBuilder = this.achievementRepository.createQueryBuilder("achievement");

		queryBuilder
			.leftJoinAndSelect('achievement.user', 'user')
			.leftJoinAndSelect('achievement.achievementType', 'achievementType')
			.where('user.id = :id', { id: user_id })
			.orderBy("achievement.id", pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}

	async createUserAchievement(user: User, achievementType_name: string)
	{
		const queryBuilderAchievement = this.achievementRepository.createQueryBuilder("achievement")
			.leftJoinAndSelect('achievement.achievementType', 'achievementType')
			.where('achievementType.name = :name', { name: achievementType_name});

		if (await queryBuilderAchievement.getCount() != 0)
			return queryBuilderAchievement.getOne();

		const queryBuilder = this.achievementTypeRepository.createQueryBuilder("achievementType");

		queryBuilder
			.where('achievementType.name = :name', { name: achievementType_name});

		const achievementType = await queryBuilder.getOne();

		if (achievementType == null)
			throw new HttpException(["You forgot to create this achievement type in the database"],
				HttpStatus.INTERNAL_SERVER_ERROR);

		const newAchievement = await this.achievementRepository.create({
			achievementType: achievementType,
			user: user
		});

		return await this.achievementRepository.save(newAchievement);
	}

	async initAchievementTypes()
	{
		const queryBuilder = this.achievementTypeRepository.createQueryBuilder("achievementType");

		queryBuilder
			.where('achievementType.name = :name', { name: 'I\'m a sociable person'});

		const achievementType = await queryBuilder.getOne();

		if (achievementType != null)
			return;
		const newAchievementType = await this.achievementTypeRepository.create({
			name: 'I\'m a sociable person',
			description: 'Send your first message',
			reward: 'A friend (maybe)',
		});

		return await this.achievementTypeRepository.save(newAchievementType);
	}
}
