import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Max, IsDate } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class Message
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'message_id',
	})
	@Max(1000000000000)
	id: number;

	@ManyToOne(() => User)
    sender: User

    @ManyToOne(() => User)
    recipient: User

	@Column({
		nullable: false,
		unique: false,
	})
	content: string;

	@IsDate()
	@Column({
		nullable: false,
		unique: false,
	})
	sent_date: string;

	@IsDate()
	@Column({
		nullable: false,
		unique: false,
	})
	received_date: string;
}