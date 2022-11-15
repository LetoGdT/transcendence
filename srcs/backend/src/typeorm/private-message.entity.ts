import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Max } from 'class-validator';
import { Message } from './message.entity';


@Entity()
export class PrivateMessage
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'message_id',
	})
	@Max(1000000000000)
	id: number;

	@OneToOne(() => Message)
	@JoinColumn()
	message: Message
}