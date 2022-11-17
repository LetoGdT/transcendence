import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Message } from './message.entity';


@Entity()
export class PrivateMessage
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'privateMessage_id',
	})
	id: number;

	@OneToOne(() => Message, { eager: true })
	@JoinColumn()
	message: Message
}