import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { Channel } from './channel.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'message_id',
	})
	id: number;

	@ManyToOne(() => User, { nullable: false, eager: true })
	@JoinColumn()
	sender: User

	@Column({
		nullable: false,
		unique: false,
	})
	content: string;

	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: false,
		unique: false,
		default: () => 'CURRENT_TIMESTAMP'
	})
	sent_date: Date;

	// This is not implemented for now, but this could be used
	// for quality of life improvements
	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		unique: false,
		// default: () => 'CURRENT_TIMESTAMP'
	})
	received_date: Date;

	@IsOptional()
	@ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
	channel?: Channel;

	@IsOptional()
	@ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
	conversation?: Conversation;
}