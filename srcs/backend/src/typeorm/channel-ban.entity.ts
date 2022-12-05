import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsIn, ValidateNested, IsDate } from 'class-validator';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
export class ChannelBan
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'channelUser_id',
	})
	id: number;

	@ValidateNested()
	@ManyToOne(() => User, { eager: true })
	@JoinColumn()
	user: User;

	@IsDate()
	@Column({
		type: 'timestamptz',
		nullable: true,
		unique: false,
		default: null
	})
	unban_date: Date;

	@ManyToOne(() => Channel, (channel) => channel.users, { onDelete: 'CASCADE' })
	channel: Channel
}
