import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength, MaxLength, IsUrl } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Achievement } from './achievement.entity';

@Entity()
export class AchievementType
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'achievementType_id',
	})
	id: number;

	@MinLength(3)
	@MaxLength(100)
	@Column({
		nullable: false,
		unique: true,
	})
	name: string;

	@Column({
		nullable: false,
	})
	description: string;

	@Column({
		nullable: true
	})
	reward: string;

	@OneToMany(() => Achievement, (achievement) => achievement.achievementType)
	achievements: Achievement[];

	@IsUrl()
	@Column({
		nullable: true
	})
	image: string;
}