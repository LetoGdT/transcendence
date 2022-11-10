import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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

	@ManyToOne(() => User, { nullable: false, eager: true })
	@JoinColumn()
    sender: User

    @ManyToOne(() => User, { nullable: false, eager: true })
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
		default: Date()
	})
	sent_date: string;

	@IsDate()
	@Column({
		nullable: false,
		unique: false,
		default: Date()
	})
	received_date: string;
}