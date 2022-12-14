import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsIn, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { ChannelUser } from './channel-user.entity';
import { Achievement } from './achievement.entity';

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
	@Expose({ groups: ["friends", "me"] })
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

	@Exclude({ toPlainOnly: true })
	@Column({
		nullable: true
	})
	secret2fa: string;

	@Column({
		default: false
	})
	enabled2fa: boolean;

	@ManyToMany(() => User, (user) => user.following, {
		cascade: true,
		nullable: false
	})
	@JoinTable()
	followers: User[];

	@ManyToMany(() => User, (user) => user.followers, {
		nullable: false,
	})
	following: User[];

	@ManyToMany(() => User, (user) => user.invited, {
		cascade: true,
		nullable: false
	})
	@JoinTable()
	invitations: User[];

	@ManyToMany(() => User, (user) => user.invitations, {
		nullable: false,
	})
	invited: User[];

	@ManyToMany(() => User)
	@JoinTable()
	banlist: User[];

	@OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
	channelUsers: ChannelUser[];

	@OneToMany(() => Achievement, (achievement) => achievement.user)
	achievements: Achievement[];

	@Column({
		nullable: false,
		default: 0
	})
	exp: number;
}