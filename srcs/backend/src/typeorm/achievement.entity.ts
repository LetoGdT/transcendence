import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AchievementType } from './achievement-type.entity';
import { User } from '../typeorm/user.entity';

@Entity()
export class Achievement
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'achievement_id',
	})
	id: number;

	@ManyToOne(() => AchievementType, (achievementType) => achievementType.achievements)
	achievementType: AchievementType;

	@ManyToOne(() => User, (user) => user.achievements)
	user: User;
}