import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Max, IsDate } from 'class-validator';

@Entity()
export class Message
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'message_id',
	})
	@Max(1000000000000)
	id: number;

	@Column({
		nullable: false,
		unique: false,
	})
	sender_id: number;

	@Column({
		nullable: false,
		unique: false,
	})
	receiver_id: number;

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
}