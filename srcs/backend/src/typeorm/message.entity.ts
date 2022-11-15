import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
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
    @JoinColumn()
    recipient: User

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

	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		unique: false,
		// default: () => 'CURRENT_TIMESTAMP'
	})
	received_date: Date;
}