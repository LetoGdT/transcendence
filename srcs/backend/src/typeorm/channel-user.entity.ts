import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, JoinTable } from 'typeorm'
import { IsIn, ValidateNested, IsBoolean } from 'class-validator';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
export class ChannelUser
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'channelUser_id',
	})
	id: number;

	@ValidateNested()
	@ManyToOne(() => User, (user) => user.channelUsers, { eager: true })
	user: User;

	@IsIn(['None', 'Admin', 'Owner'])
	@Column()
	role: 'None' | 'Admin' | 'Owner';

	@IsBoolean()
	@Column({
		nullable: false,
		default: false
	})
	is_muted: Boolean;

	@ManyToOne(() => Channel, (channel) => channel.users, { onDelete: 'CASCADE' })
	channel: Channel
}
