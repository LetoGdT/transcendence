import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { IsNotEmpty, MaxLength, MinLength, IsAscii, IsIn, Matches } from 'class-validator';
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
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	@Column({
		nullable: false,
		unique: true,
	})
	name: string;

	@OneToMany(() => ChannelUser, (channelUser) => channelUser.channel, {
		eager: true,
		onDelete: 'CASCADE',
		cascade: true
	})
	users: ChannelUser[];

	@OneToMany(() => Message, (message) => message.channel, { cascade: true, eager: true })
	@JoinColumn()
	messages: Message[];

	@IsIn(['public', 'private', 'protected'])
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