import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

class ChannelUser
{
	@ManyToMany(() => User, { eager: true })
	@JoinColumn()
	user: User;
	
	@Column()
	role: 'None' | 'Admin' | 'Owner';
}

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'channel_id',
	})
	id: number;

	@Column(() => ChannelUser)
	users: ChannelUser[];

	@OneToMany(() => Message, (message) => message.channel)
	@JoinColumn()
	messages: Message[];

	@Column()
	status: 'public' | 'private' | 'protected';

	@ManyToMany(() => User, { eager: true })
	@JoinColumn()
	banned: User[];

	@Column()
	password: string;
}