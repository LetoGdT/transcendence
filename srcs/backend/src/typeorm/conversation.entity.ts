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

	@ManyToOne(() => User, { eager: true })
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User, { eager: true })
	@JoinColumn()
	user2: User;

	@OneToMany(() => Message, (message) => message.conversation , { eager: true, onDelete: 'CASCADE' })
	@JoinColumn()
	messages: Message[];

	@Exclude()
	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		default: null
	})
	latest_sent: Date;
}