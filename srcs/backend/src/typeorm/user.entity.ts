import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsDate, IsIn, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { ChannelUser } from './channel-user.entity';

@Entity()
export class User
{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'user_id',
	})
	id: number;

	@Column({
		nullable: false,
		unique: true,
	})
	uid: number;

	@MinLength(3)
	@MaxLength(20)
	@Matches('^[ A-Za-z0-9_\\-!?]*$')
	@Column({
		nullable: false,
		default: '',
		unique: true,
	})
	username: string;

	@IsEmail()
	@Column({
		name: 'email_address',
		nullable: false,
		default: '',
	})
	email: string;

	@Column({
		nullable: false,
		default: '',
	})
	image_url: string;

	@IsIn(['online', 'offline', 'in-game'])
	@Column({
		nullable: false,
		default: 'online',
	})
	status: 'online' | 'offline' | 'in-game';

	@Exclude({ toPlainOnly: true })
	@Column({
		nullable: true,
		default: '',
	})
	refresh_token: string;

	@IsDate()
	@Exclude({ toPlainOnly: true })
	@Column({
		nullable: true,
		default: '',
	})
	refresh_expires: string;

	@ManyToMany(() => User, (user) => user.following, { cascade: true })
	@JoinTable()
	followers: User[];

	@ManyToMany(() => User, (user) => user.followers)
	following: User[];

	@ManyToMany(() => User, (user) => user.invited)
	@JoinTable()
	invitation: User[];

	@ManyToMany(() => User, (user) => user.invitation, { cascade: true })
	invited: User[];

	@OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
	channelUsers: ChannelUser;
}