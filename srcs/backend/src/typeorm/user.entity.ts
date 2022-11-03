import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

	@Column({
		nullable: false,
		default: '',
		unique: true,
	})
	username: string;

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

	@Exclude({ toPlainOnly: true })
	@Column({
		nullable: true,
		default: '',
	})
	refresh_token: string;

	@Exclude({ toPlainOnly: true })
	@Column({
		nullable: true,
		default: '',
	})
	refresh_expires: string;
}