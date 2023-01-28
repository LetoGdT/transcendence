import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Message } from './message.entity';
import { User } from './user.entity';


@Entity()
export class Conversation
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'conversationId',
	})
	id: number;

	@ManyToOne(() => User, { eager: true, nullable: false })
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User, { eager: true, nullable: false })
	@JoinColumn()
	user2: User;

	@OneToMany(() => Message, (message) => message.conversation , { eager: true, onDelete: 'CASCADE', cascade: true })
	@JoinColumn()
	messages: Message[];

	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	latest_sent: Date;
}
