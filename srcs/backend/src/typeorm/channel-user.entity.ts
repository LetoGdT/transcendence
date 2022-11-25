import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, JoinTable } from 'typeorm'
import { IsIn, ValidateNested } from 'class-validator';
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
	@ManyToOne(() => User, { eager: true })
	@JoinColumn()
	user: User;

	@IsIn(['None', 'Admin', 'Owner'])
	@Column()
	role: 'None' | 'Admin' | 'Owner';

	@ManyToOne(() => Channel, (channel) => channel.users, { onDelete: 'CASCADE' })
	channel: Channel
}
