import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';


@Entity()
export class PrivateMessage
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'privateMessage_id',
	})
	id: number;

	@ManyToOne(() => User, { nullable: true, eager: true })
	@JoinColumn()
	recipient: User

	@OneToOne(() => Message, { eager: true })
	@JoinColumn()
	message: Message;
}