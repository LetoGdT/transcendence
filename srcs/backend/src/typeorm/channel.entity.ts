import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { IsNotEmpty, MaxLength, MinLength, IsAscii } from 'class-validator';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ChannelUser } from './channel-user.entity';

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'channel_id',
	})
	id: number;

	@MinLength(3)
	@MaxLength(20)
	@Column({
		nullable: false,
		unique: true,
	})
	name: string;

	@OneToMany(() => ChannelUser, (channelUser) => channelUser.channel, { cascade: true })
	@JoinColumn()
	users: ChannelUser[];

	@OneToMany(() => Message, (message) => message.channel)
	@JoinColumn()
	messages: Message[];

	@Column({
		default: 'private',
	})
	status: 'public' | 'private' | 'protected';

	@ManyToMany(() => User, { eager: true })
	@JoinColumn()
	banlist: User[];

	@Exclude({ toPlainOnly: true })
	@IsAscii()
	@MinLength(8)
	@MaxLength(40)
	@Column({
		nullable: true,
		unique: false,
	})
	password: string;
}