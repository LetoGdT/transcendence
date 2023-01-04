import { IsDate, IsIn } from 'class-validator';
import { User } from '../typeorm/user.entity';

export class CreateMatchDto
{
	user1: User;

	user2: User;

	score_user1: number;

	score_user2: number;

	winner: User;

	played_at: Date;

	game_type: 'Quick play' | 'Ranked';
}