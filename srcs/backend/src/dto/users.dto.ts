export class CreateUserDto
{
	login: string;
	email: string;
	image_url: string;
}

export class ReturnUserDto
{
	id: number
	login: string;
	email: string;
	image_url: string;
}