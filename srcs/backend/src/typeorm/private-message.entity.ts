import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Message } from './message.entity';


@Entity()
export class PrivateMessage
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'message_id',
	})
	id: number;

	@OneToOne(() => Message)
	@JoinColumn()
	message: Message
}