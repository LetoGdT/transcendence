import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
		default: '',
	})
	login: string;

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

	@Column({
		nullable: true,
		default: '',
	})
	refresh_token: string;
}