import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
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

	@ManyToOne(() => User, { eager: true })
	@JoinColumn()
	user: User;

	@Column()
	role: 'None' | 'Admin' | 'Owner';

	@ManyToOne(() => Channel, (channel) => channel.users)
	channel: Channel
}

