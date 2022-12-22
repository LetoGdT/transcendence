import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Max, IsDate, IsOptional, IsIn } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class Match
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'match_id',
	})
	id: number;

	@ManyToOne(() => User, { eager: true, nullable: false })
	user1: User;

	@ManyToOne(() => User, { eager: true, nullable: false })
	user2: User;

	@Column({
		nullable: false
	})
	score_user1: number;

	@Column({
		nullable: false
	})
	score_user2: number;

	@ManyToOne(() => User, { eager: true, nullable: false })
	winner: User;

	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		default: null
	})
	played_at: Date;

	@IsIn(['Quick play', 'Ranked'])
	@Column({
		nullable: false
	})
	game_type: 'Quick play' | 'Ranked';
}